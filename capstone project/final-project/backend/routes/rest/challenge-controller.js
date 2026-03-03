import { Router } from 'express';
import sequelize from '#root/services/sequelize.js';
import Challenge, { validateChallengeData } from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import User from '#root/models/user.js';
import Submission from '#root/models/submission.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import SubmissionScoreBreakdown from '#root/models/submission-score-breakdown.js';
import StudentBadge from '#root/models/student-badges.js';
import Badge from '#root/models/badge.js';
import Title from '#root/models/title.js';
import {
  ChallengeStatus,
  SubmissionStatus,
  VoteType,
  Scoring_Availability,
} from '#root/models/enum/enums.js';
import { handleException } from '#root/services/error.js';
import getValidator from '#root/services/validator.js';
import {
  getChallengeParticipants,
  joinChallenge,
} from '#root/services/challenge-participant.js';
import assignMatches from '#root/services/assign-matches.js';
import startChallengeService from '#root/services/start-challenge.js';
import startPeerReviewService from '#root/services/start-peer-review.js';
import assignPeerReviews from '#root/services/assign-peer-reviews.js';
import { broadcastEvent } from '#root/services/event-stream.js';
import {
  schedulePhaseOneEndForChallenge,
  schedulePhaseTwoEndForChallenge,
} from '#root/services/challenge-scheduler.js';
import { executeCodeTests } from '#root/services/execute-code-tests.js';
import { validateImportsBlock } from '#root/services/import-validation.js';
import {
  normalizeOutputForComparison,
  runReferenceSolution,
} from '#root/services/reference-solution-evaluation.js';
import logger from '#root/services/logger.js';
import { Op } from 'sequelize';
import getPeerReviewSummary from '#root/services/peer-review-summary.js';
import { calculateChallengeScores } from '#root/services/scoring-service.js';
import finalizePeerReviewChallenge from '#root/services/finalize-peer-review.js';
import { finalizeMissingSubmissionsForChallenge } from '#root/services/submission-finalization.js';
import {
  PHASE_ONE_AUTOSUBMIT_GRACE_MS,
  getInFlightSubmissionsCount,
  maybeCompletePhaseOneFinalization,
} from '#root/services/phase-one-finalization.js';
import {
  awardChallengeMilestoneBadges,
  awardReviewMilestoneBadges,
  awardReviewQualityBadges,
  getReviewBadgesEarnedSince,
} from '#root/services/challenge-completed-badges.js';

const router = Router();

const getRequestRole = (req) =>
  req.session?.user?.role || req.user?.role || null;
const getRequestUser = (req) => req.session?.user || req.user || null;
const isPrivilegedRole = (role) => role === 'teacher' || role === 'admin';
const shouldHidePrivate = (req) => !isPrivilegedRole(getRequestRole(req));
const isEndedStatus = (status) =>
  status === ChallengeStatus.ENDED_PHASE_ONE ||
  status === ChallengeStatus.ENDED_PHASE_TWO;
const emitChallengeUpdate = (challenge) => {
  if (!challenge) return;
  broadcastEvent({
    event: 'challenge-updated',
    data: {
      challengeId: challenge.id,
      status: challenge.status,
    },
  });
};

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const normalizeCustomTests = (tests) =>
  (Array.isArray(tests) ? tests : [])
    .filter((testCase) => testCase && hasOwn(testCase, 'input'))
    .map((testCase) => ({
      input: testCase.input,
      output: hasOwn(testCase, 'output') ? testCase.output : null,
    }));

const normalizeFeedbackTests = (tests) =>
  (Array.isArray(tests) ? tests : [])
    .filter((testCase) => testCase && hasOwn(testCase, 'input'))
    .map((testCase) => ({
      input: testCase.input,
      expectedOutput: hasOwn(testCase, 'expectedOutput')
        ? testCase.expectedOutput
        : null,
      notes:
        typeof testCase.notes === 'string' && testCase.notes.trim()
          ? testCase.notes.trim()
          : null,
    }));

const parseTestResults = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseJsonValue = (value) => {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const parseJsonValueStrict = (value, label) => {
  if (value === null || value === undefined) {
    return { ok: false, error: `${label} is required.` };
  }
  if (typeof value !== 'string') return { ok: true, value };
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch {
    return { ok: false, error: `${label} must be valid JSON.` };
  }
};

router.get('/challenges', async (req, res) => {
  try {
    const where = shouldHidePrivate(req)
      ? { status: { [Op.ne]: 'private' } }
      : undefined;
    const challenges = await Challenge.findAll({
      where,
      include: [
        {
          model: MatchSetting,
          as: 'matchSettings',
          through: { attributes: [] },
        },
      ],
      order: Challenge.getDefaultOrder(),
    });

    const challengeIds = challenges.map((challenge) => challenge.id);
    const matchesCountByChallenge = {};
    const finalMatchIdsByChallenge = {};

    if (challengeIds.length > 0) {
      const allMatches = await Match.findAll({
        attributes: ['id'],
        include: [
          {
            model: ChallengeMatchSetting,
            as: 'challengeMatchSetting',
            attributes: ['challengeId'],
            where: { challengeId: { [Op.in]: challengeIds } },
          },
        ],
      });

      const allFinalSubmissions = await Submission.findAll({
        attributes: ['matchId'],
        where: { isFinal: true },
        include: [
          {
            model: Match,
            as: 'match',
            attributes: ['id'],
            required: true,
            include: [
              {
                model: ChallengeMatchSetting,
                as: 'challengeMatchSetting',
                attributes: ['challengeId'],
                required: true,
                where: { challengeId: { [Op.in]: challengeIds } },
              },
            ],
          },
        ],
      });

      allMatches.forEach((matchRow) => {
        const cId = matchRow.challengeMatchSetting?.challengeId;
        if (cId) {
          matchesCountByChallenge[cId] =
            (matchesCountByChallenge[cId] || 0) + 1;
        }
      });

      allFinalSubmissions.forEach((submission) => {
        const cId = submission.match?.challengeMatchSetting?.challengeId;
        if (!cId) return;
        if (!finalMatchIdsByChallenge[cId]) {
          finalMatchIdsByChallenge[cId] = new Set();
        }
        finalMatchIdsByChallenge[cId].add(submission.matchId);
      });
    }

    const data = challenges.map((challenge) => {
      const totalMatches = matchesCountByChallenge[challenge.id] || 0;
      const finalSubmissionCount = finalMatchIdsByChallenge[challenge.id]
        ? finalMatchIdsByChallenge[challenge.id].size
        : 0;
      const pendingFinalCount = Math.max(
        0,
        totalMatches - finalSubmissionCount
      );
      return {
        ...challenge.toJSON(),
        totalMatches,
        finalSubmissionCount,
        pendingFinalCount,
        resultsReady: totalMatches > 0 && pendingFinalCount === 0,
      };
    });
    res.json({ success: true, data });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/challenges/for-student', async (req, res) => {
  try {
    const studentId = Number(req.query.studentId);
    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid studentId',
      });
    }

    const where = shouldHidePrivate(req)
      ? { status: { [Op.ne]: 'private' } }
      : undefined;

    const challenges = await Challenge.findAll({
      where,
      order: Challenge.getDefaultOrder(),
    });

    const endedChallengeIds = challenges
      .filter((c) => c.status === ChallengeStatus.ENDED_PHASE_TWO)
      .map((c) => c.id);

    const resultsReadyMap = new Map();

    if (endedChallengeIds.length > 0) {
      const allMatches = await Match.findAll({
        attributes: ['id'],
        include: [
          {
            model: ChallengeMatchSetting,
            as: 'challengeMatchSetting',
            attributes: ['challengeId'],
            where: { challengeId: { [Op.in]: endedChallengeIds } },
          },
        ],
      });

      const allFinalSubmissions = await Submission.findAll({
        attributes: ['matchId'],
        where: { isFinal: true },
        include: [
          {
            model: Match,
            as: 'match',
            attributes: ['id'],
            required: true,
            include: [
              {
                model: ChallengeMatchSetting,
                as: 'challengeMatchSetting',
                attributes: ['challengeId'],
                required: true,
                where: { challengeId: { [Op.in]: endedChallengeIds } },
              },
            ],
          },
        ],
      });

      const matchesCountByChallenge = {};
      const finalMatchIdsByChallenge = {};

      allMatches.forEach((m) => {
        const cId = m.challengeMatchSetting?.challengeId;
        if (cId) {
          matchesCountByChallenge[cId] =
            (matchesCountByChallenge[cId] || 0) + 1;
        }
      });

      allFinalSubmissions.forEach((s) => {
        const cId = s.match?.challengeMatchSetting?.challengeId;
        if (cId) {
          if (!finalMatchIdsByChallenge[cId]) {
            finalMatchIdsByChallenge[cId] = new Set();
          }
          finalMatchIdsByChallenge[cId].add(s.matchId);
        }
      });

      endedChallengeIds.forEach((id) => {
        const total = matchesCountByChallenge[id] || 0;
        const final = finalMatchIdsByChallenge[id]
          ? finalMatchIdsByChallenge[id].size
          : 0;
        resultsReadyMap.set(id, total > 0 && final === total);
      });
    }

    const participations = await ChallengeParticipant.findAll({
      where: { studentId },
      attributes: ['challengeId'],
      raw: true,
    });
    const joinedSet = new Set(participations.map((row) => row.challengeId));

    const data = challenges.map((challenge) => ({
      id: challenge.id,
      title: challenge.title,
      status: challenge.status,
      scoringStatus: challenge.scoringStatus,
      startDatetime: challenge.startDatetime,
      startPhaseOneDateTime: challenge.startPhaseOneDateTime,
      endPhaseOneDateTime: challenge.endPhaseOneDateTime,
      startPhaseTwoDateTime: challenge.startPhaseTwoDateTime,
      endPhaseTwoDateTime: challenge.endPhaseTwoDateTime,
      duration: challenge.duration,
      durationPeerReview: challenge.durationPeerReview,
      joined: joinedSet.has(challenge.id),
      resultsReady: resultsReadyMap.has(challenge.id)
        ? resultsReadyMap.get(challenge.id)
        : false,
    }));

    return res.json({ success: true, data });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/challenges', async (req, res) => {
  const trimmedTitle =
    typeof req.body.title === 'string' ? req.body.title.trim() : req.body.title;
  const payload = {
    title: trimmedTitle,
    duration: req.body.duration,
    startDatetime: req.body.startDatetime,
    endDatetime: req.body.endDatetime,
    durationPeerReview: req.body.durationPeerReview,
    allowedNumberOfReview: req.body.allowedNumberOfReview ?? 5,
    status: req.body.status || 'private',
  };
  const matchSettingIds = req.body.matchSettingIds || [];
  if (matchSettingIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'At least one match setting is required.' },
    });
  }
  let transaction;
  try {
    await validateChallengeData(payload, {
      validatorKey: 'challenge',
    });

    // Check if duration fits within the time window
    const start = new Date(payload.startDatetime);
    const end = new Date(payload.endDatetime);
    const durationInMs = payload.duration * 60 * 1000; // duration is in minutes
    const windowInMs = end.getTime() - start.getTime();

    if (windowInMs < durationInMs) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            'The time window (endDatetime - startDatetime) must be greater than or equal to the duration.',
        },
      });
    }

    // Validate matchSettingIds before checking overlaps
    // This ensures we return the correct error for invalid matchSettingIds
    const settings = await MatchSetting.findAll({
      where: { id: matchSettingIds },
    });
    if (settings.length !== matchSettingIds.length) {
      const foundIds = settings.map((s) => s.id);
      const missingIds = matchSettingIds.filter((id) => !foundIds.includes(id));
      return res.status(400).json({
        success: false,
        error: {
          message: 'One or more match settings not found.',
          missingIds,
        },
      });
    }

    if (payload.status === ChallengeStatus.PUBLIC) {
      // Check for overlapping challenges only when publishing
      const overlappingChallenge = await Challenge.findOne({
        where: {
          startDatetime: { [Op.lt]: payload.endDatetime },
          endDatetime: { [Op.gt]: payload.startDatetime },
        },
      });

      const allowOverlap = Boolean(req.body.allowOverlap);
      if (overlappingChallenge && !allowOverlap) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Challenge time overlaps with an existing challenge.',
            code: 'challenge_overlap',
          },
        });
      }
      if (overlappingChallenge && allowOverlap) {
        payload.status = ChallengeStatus.PRIVATE;
      }
    }

    transaction = await sequelize.transaction();
    const challenge = await Challenge.create(payload, { transaction });
    await challenge.addMatchSettings(settings, { transaction });
    await transaction.commit();
    const createdChallenge = await Challenge.findByPk(challenge.id, {
      include: [
        {
          model: MatchSetting,
          as: 'matchSettings',
          through: { attributes: [] },
        },
      ],
    });
    emitChallengeUpdate(createdChallenge);
    res.status(201).json({
      success: true,
      challenge: createdChallenge,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test')
      console.error('Create Challenge Error:', error);
    if (transaction) await transaction.rollback();
    handleException(res, error);
  }
});

const validateJoinChallenge = getValidator('join-challenge');
router.post('/challenges/:challengeId/join', async (req, res) => {
  try {
    if (!validateJoinChallenge) {
      return res.status(500).json({
        success: false,
        error: 'Join-challenge validator not found',
      });
    }
    const valid = validateJoinChallenge(req.body);
    if (!valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid join payload',
        details: validateJoinChallenge.errors,
      });
    }

    const { studentId } = req.body;

    const { challengeId: rawChallengeId } = req.params;

    const challengeId = Number(rawChallengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challengeId',
      });
    }
    const { status, participation } = await joinChallenge({
      studentId: Number(studentId),
      challengeId,
    });

    if (status === 'challenge_not_found') {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    if (status === 'challenge_private') {
      return res.status(403).json({
        success: false,
        error: 'Challenge is private',
      });
    }

    if (status === 'student_not_found') {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    if (status === 'already_joined') {
      return res.status(409).json({
        success: false,
        error: 'Student already joined this challenge',
      });
    }

    if (status === 'ok') {
      const participantsCount = await ChallengeParticipant.count({
        where: { challengeId },
      });
      broadcastEvent({
        event: 'challenge-participant-joined',
        data: {
          challengeId,
          count: participantsCount,
        },
      });
    }

    return res.json({
      success: true,
      result: participation,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/challenges/:challengeId/participants', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challengeId',
      });
    }

    if (shouldHidePrivate(req)) {
      const challenge = await Challenge.findByPk(challengeId);
      if (!challenge) {
        return res.status(404).json({
          success: false,
          error: 'Challenge not found',
        });
      }
      if (challenge.status === 'private') {
        return res.status(403).json({
          success: false,
          error: 'Challenge is private',
        });
      }
    }

    const result = await getChallengeParticipants({ challengeId });

    if (result.status === 'error') {
      console.error('Error getting participants:', result.error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }

    const data = result.participants || [];

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/challenges/:challengeId/assign', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const overwrite =
      String(req.query.overwrite || '').toLowerCase() === 'true';
    const result = await assignMatches({ challengeId, overwrite });

    if (result.status === 'challenge_not_found') {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }
    if (result.status === 'no_match_settings') {
      return res.status(400).json({
        success: false,
        error: 'No match settings selected for this challenge',
      });
    }
    if (result.status === 'no_participants') {
      return res
        .status(400)
        .json({ success: false, error: 'No participants joined' });
    }
    if (result.status === 'already_assigned' && !overwrite) {
      return res.status(409).json({
        success: false,
        error: 'Assignments already exist. Use ?overwrite=true to reassign.',
      });
    }
    if (result.status === 'too_early') {
      return res.status(400).json({
        success: false,
        error: 'Challenge cannot be assigned before its start time.',
      });
    }

    const updatedChallenge = await Challenge.findByPk(challengeId);
    emitChallengeUpdate(updatedChallenge);
    return res.json({ success: true, ...result });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/challenges/:challengeId/matches', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }
    if (shouldHidePrivate(req) && challenge.status === 'private') {
      return res.status(403).json({
        success: false,
        error: 'Challenge is private',
      });
    }

    const matches = await Match.findAll({
      include: [
        {
          model: ChallengeMatchSetting,
          as: 'challengeMatchSetting',
          where: { challengeId },
          include: [{ model: MatchSetting, as: 'matchSetting' }],
        },
        {
          model: ChallengeParticipant,
          as: 'challengeParticipant',
          include: [{ model: User, as: 'student' }],
        },
      ],
      order: [
        ['id', 'ASC'],
        [{ model: ChallengeMatchSetting, as: 'challengeMatchSetting' }, 'id'],
      ],
    });

    const matchIds = matches.map((matchRow) => matchRow.id);
    const matchSettingByMatchId = new Map(
      matches.map((matchRow) => [matchRow.id, matchRow.challengeMatchSettingId])
    );
    const participantById = new Map();
    matches.forEach((matchRow) => {
      const student = matchRow.challengeParticipant?.student;
      if (!student) return;
      participantById.set(matchRow.challengeParticipantId, {
        participantId: matchRow.challengeParticipantId,
        studentId: student.id,
        username: student.username,
      });
    });

    const validSubmissionCounts = {};
    const validSubmissionIds = [];
    let totalSubmissionsCount = 0;
    let finalSubmissionCount = 0;
    const totalMatches = matches.length;

    if (matchIds.length > 0) {
      finalSubmissionCount = await Submission.count({
        where: {
          matchId: { [Op.in]: matchIds },
          isFinal: true,
        },
      });

      totalSubmissionsCount = await Submission.count({
        where: {
          matchId: { [Op.in]: matchIds },
          isFinal: true,
          code: { [Op.ne]: '' },
        },
      });

      const validSubmissions = await Submission.findAll({
        attributes: ['id', 'matchId', 'challengeParticipantId'],
        where: {
          matchId: { [Op.in]: matchIds },
          isFinal: true,
          status: {
            [Op.in]: [
              SubmissionStatus.IMPROVABLE,
              SubmissionStatus.PROBABLY_CORRECT,
            ],
          },
        },
        raw: true,
      });

      validSubmissions.forEach(({ id, matchId }) => {
        const cmsId = matchSettingByMatchId.get(matchId);
        if (!cmsId) return;
        validSubmissionIds.push(id);
        validSubmissionCounts[cmsId] = (validSubmissionCounts[cmsId] || 0) + 1;
      });
    }

    const peerReviewAssignmentsByCms = {};
    const peerReviewAssignmentsCountByCms = {};

    if (validSubmissionIds.length > 0) {
      const peerAssignments = await PeerReviewAssignment.findAll({
        where: { submissionId: { [Op.in]: validSubmissionIds } },
        include: [
          {
            model: Submission,
            as: 'submission',
            attributes: ['id', 'matchId', 'challengeParticipantId'],
          },
          {
            model: ChallengeParticipant,
            as: 'reviewer',
            attributes: ['id'],
            include: [
              { model: User, as: 'student', attributes: ['id', 'username'] },
            ],
          },
        ],
      });

      const reviewerMaps = new Map();

      peerAssignments.forEach((assignment) => {
        const submission = assignment.submission;
        if (!submission) return;
        const cmsId = matchSettingByMatchId.get(submission.matchId);
        if (!cmsId) return;

        if (!reviewerMaps.has(cmsId)) {
          reviewerMaps.set(cmsId, new Map());
        }

        const reviewerMap = reviewerMaps.get(cmsId);
        const reviewerParticipantId = assignment.reviewerId;
        const reviewerInfo = participantById.get(reviewerParticipantId) || {
          participantId: reviewerParticipantId,
          studentId: assignment.reviewer?.student?.id ?? null,
          username:
            assignment.reviewer?.student?.username ||
            `Student ${reviewerParticipantId}`,
        };

        if (!reviewerMap.has(reviewerParticipantId)) {
          reviewerMap.set(reviewerParticipantId, {
            reviewer: reviewerInfo,
            reviewees: [],
          });
        }

        const revieweeInfo = participantById.get(
          submission.challengeParticipantId
        ) || {
          participantId: submission.challengeParticipantId,
          studentId: null,
          username: `Student ${submission.challengeParticipantId}`,
        };

        reviewerMap.get(reviewerParticipantId).reviewees.push({
          ...revieweeInfo,
          submissionId: submission.id,
          isExtra: assignment.isExtra,
        });

        peerReviewAssignmentsCountByCms[cmsId] =
          (peerReviewAssignmentsCountByCms[cmsId] || 0) + 1;
      });

      reviewerMaps.forEach((reviewerMap, cmsId) => {
        peerReviewAssignmentsByCms[cmsId] = Array.from(reviewerMap.values());
      });
    }

    const eligibleGroupIds = Object.entries(validSubmissionCounts)
      .filter(([, count]) => count > 1)
      .map(([cmsId]) => Number(cmsId));
    const peerReviewReady =
      eligibleGroupIds.length > 0 &&
      eligibleGroupIds.every(
        (cmsId) => (peerReviewAssignmentsCountByCms[cmsId] || 0) > 0
      );
    const totalValidSubmissions = validSubmissionIds.length;

    const grouped = {};
    matches.forEach((matchRow) => {
      const cmsId = matchRow.challengeMatchSettingId;
      if (!grouped[cmsId]) {
        grouped[cmsId] = {
          challengeMatchSettingId: cmsId,
          matchSetting: matchRow.challengeMatchSetting?.matchSetting
            ? {
                id: matchRow.challengeMatchSetting.matchSetting.id,
                problemTitle:
                  matchRow.challengeMatchSetting.matchSetting.problemTitle,
              }
            : null,
          validSubmissionsCount: validSubmissionCounts[cmsId] || 0,
          peerReviewAssignments: peerReviewAssignmentsByCms[cmsId] || [],
          matches: [],
        };
      }

      grouped[cmsId].matches.push({
        id: matchRow.id,
        student: matchRow.challengeParticipant?.student
          ? {
              id: matchRow.challengeParticipant.student.id,
              username: matchRow.challengeParticipant.student.username,
            }
          : null,
      });
    });

    const inFlightSubmissionsCount = getInFlightSubmissionsCount(challengeId);
    const pendingFinalCount = Math.max(0, totalMatches - finalSubmissionCount);
    const withinAutosubmitGrace = (() => {
      if (challenge.status !== ChallengeStatus.ENDED_PHASE_ONE) return false;
      if (!PHASE_ONE_AUTOSUBMIT_GRACE_MS) return false;
      if (!challenge.endPhaseOneDateTime) return false;
      const endMs = new Date(challenge.endPhaseOneDateTime).getTime();
      if (Number.isNaN(endMs)) return false;
      return Date.now() - endMs < PHASE_ONE_AUTOSUBMIT_GRACE_MS;
    })();
    const gracePendingCount = withinAutosubmitGrace ? 1 : 0;
    const pendingFinalizationCount =
      challenge.status === ChallengeStatus.ENDED_PHASE_ONE
        ? pendingFinalCount + inFlightSubmissionsCount + gracePendingCount
        : pendingFinalCount;
    const resultsReady = pendingFinalizationCount === 0;

    return res.json({
      success: true,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        status: challenge.status,
        startDatetime: challenge.startDatetime,
        startPhaseOneDateTime: challenge.startPhaseOneDateTime,
        endPhaseOneDateTime: challenge.endPhaseOneDateTime,
        startPhaseTwoDateTime: challenge.startPhaseTwoDateTime,
        endPhaseTwoDateTime: challenge.endPhaseTwoDateTime,
        duration: challenge.duration,
        durationPeerReview: challenge.durationPeerReview,
        allowedNumberOfReview: challenge.allowedNumberOfReview,
        totalMatches,
        finalSubmissionCount,
        pendingFinalCount: pendingFinalizationCount,
        resultsReady,
        inFlightSubmissionsCount,
        phaseOneFinalizationCompletedAt:
          challenge.phaseOneFinalizationCompletedAt,
        validSubmissionsCount: totalValidSubmissions,
        totalSubmissionsCount,
        peerReviewReady,
      },
      assignments: Object.values(grouped),
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.patch('/challenges/:challengeId/expected-reviews', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const expectedReviews = Number(
      req.body?.expectedReviewsPerSubmission ?? req.body?.allowedNumberOfReview
    );
    if (!Number.isInteger(expectedReviews) || expectedReviews < 2) {
      return res.status(400).json({
        success: false,
        error:
          'Expected reviews per submission must be an integer greater than or equal to 2.',
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (shouldHidePrivate(req) && challenge.status === 'private') {
      return res.status(403).json({
        success: false,
        error: 'Challenge is private',
      });
    }

    if (
      challenge.status === ChallengeStatus.STARTED_PHASE_TWO ||
      challenge.status === ChallengeStatus.ENDED_PHASE_TWO
    ) {
      return res.status(409).json({
        success: false,
        error: 'Expected reviews cannot be updated after peer review starts.',
        currentStatus: challenge.status,
      });
    }

    if (challenge.allowedNumberOfReview !== expectedReviews) {
      await challenge.update({ allowedNumberOfReview: expectedReviews });
    }

    return res.json({
      success: true,
      challenge: {
        id: challenge.id,
        allowedNumberOfReview: challenge.allowedNumberOfReview,
        status: challenge.status,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post(
  '/challenges/:challengeId/peer-reviews/assign',
  async (req, res) => {
    try {
      const challengeId = Number(req.params.challengeId);
      if (!Number.isInteger(challengeId) || challengeId < 1) {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid challengeId' });
      }

      const expectedReviews =
        req.body?.expectedReviewsPerSubmission ??
        req.body?.allowedNumberOfReview;

      const result = await assignPeerReviews({
        challengeId,
        expectedReviewsPerSubmission: expectedReviews,
      });

      if (result.status === 'invalid_expected_reviews') {
        return res.status(400).json({
          success: false,
          error:
            'Expected reviews per submission must be an integer greater than or equal to 2.',
        });
      }

      if (result.status === 'challenge_not_found') {
        return res
          .status(404)
          .json({ success: false, error: 'Challenge not found' });
      }

      if (result.status === 'invalid_status') {
        return res.status(409).json({
          success: false,
          error: 'Peer review can only be assigned after coding ends.',
          currentStatus: result.challengeStatus,
        });
      }

      if (result.status === 'finalization_pending') {
        return res.status(409).json({
          success: false,
          error:
            'Submissions are still being finalized. Try again in a moment.',
          inFlightSubmissionsCount: result.inFlightSubmissionsCount,
        });
      }

      if (result.status === 'no_matches') {
        return res.status(400).json({
          success: false,
          error: 'No matches assigned for this challenge.',
        });
      }

      if (result.status !== 'ok') {
        return res.status(500).json({
          success: false,
          error: 'Unable to assign peer reviews.',
        });
      }

      return res.json({ success: true, ...result });
    } catch (error) {
      handleException(res, error);
    }
  }
);

router.get(
  '/challenges/:challengeId/peer-reviews/for-student',
  async (req, res) => {
    try {
      const challengeId = Number(req.params.challengeId);
      const studentId = Number(req.query.studentId);
      if (!Number.isInteger(challengeId) || challengeId < 1) {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid challengeId' });
      }
      if (!Number.isInteger(studentId) || studentId < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid studentId',
        });
      }

      const challenge = await Challenge.findByPk(challengeId);
      if (!challenge) {
        return res
          .status(404)
          .json({ success: false, error: 'Challenge not found' });
      }
      if (shouldHidePrivate(req) && challenge.status === 'private') {
        return res.status(403).json({
          success: false,
          error: 'Challenge is private',
        });
      }

      const participant = await ChallengeParticipant.findOne({
        where: { challengeId, studentId },
      });
      if (!participant) {
        return res.status(404).json({
          success: false,
          error: 'Participant not found for this challenge and student',
        });
      }

      const assignments = await PeerReviewAssignment.findAll({
        where: { reviewerId: participant.id },
        include: [
          {
            model: Submission,
            as: 'submission',
            attributes: ['id', 'code', 'matchId', 'challengeParticipantId'],
            include: [
              {
                model: Match,
                as: 'match',
                attributes: ['id', 'challengeMatchSettingId'],
                include: [
                  {
                    model: ChallengeMatchSetting,
                    as: 'challengeMatchSetting',
                    attributes: ['id'],
                    where: { challengeId },
                  },
                ],
              },
              {
                model: ChallengeParticipant,
                as: 'challengeParticipant',
                attributes: ['id'],
                include: [
                  {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username'],
                  },
                ],
              },
            ],
          },
        ],
      });

      const assignmentItems = assignments
        .filter((assignment) => assignment.submission)
        .map((assignment) => ({
          id: assignment.id,
          submissionId: assignment.submission.id,
          code: assignment.submission.code,
          matchId: assignment.submission.matchId,
          isExtra: assignment.isExtra,
          author: assignment.submission.challengeParticipant?.student
            ? {
                id: assignment.submission.challengeParticipant.student.id,
                username:
                  assignment.submission.challengeParticipant.student.username,
              }
            : null,
        }));

      return res.json({
        success: true,
        challenge: {
          id: challenge.id,
          status: challenge.status,
          startPhaseTwoDateTime: challenge.startPhaseTwoDateTime,
          endPhaseTwoDateTime: challenge.endPhaseTwoDateTime,
          durationPeerReview: challenge.durationPeerReview,
        },
        assignments: assignmentItems,
      });
    } catch (error) {
      handleException(res, error);
    }
  }
);
router.get(
  '/challenges/:challengeId/peer-reviews/summary',
  async (req, res) => {
    try {
      const challengeId = Number(req.params.challengeId);
      const studentId = Number(req.query.studentId);

      if (!Number.isInteger(challengeId) || challengeId < 1) {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid challengeId' });
      }
      if (!Number.isInteger(studentId) || studentId < 1) {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid studentId' });
      }

      const result = await getPeerReviewSummary({ challengeId, studentId });

      if (result.status === 'challenge_not_found') {
        return res
          .status(404)
          .json({ success: false, error: 'Challenge not found' });
      }
      if (result.status === 'participant_not_found') {
        return res
          .status(404)
          .json({ success: false, error: 'Participant not found' });
      }

      return res.json({ success: true, summary: result.summary });
    } catch (error) {
      handleException(res, error);
    }
  }
);

router.post(
  '/challenges/:challengeId/peer-reviews/:assignmentId/tests',
  async (req, res) => {
    try {
      const challengeId = Number(req.params.challengeId);
      const assignmentId = Number(req.params.assignmentId);
      if (!Number.isInteger(challengeId) || challengeId < 1) {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid challengeId' });
      }
      if (!Number.isInteger(assignmentId) || assignmentId < 1) {
        return res
          .status(400)
          .json({ success: false, error: 'Invalid assignmentId' });
      }

      const studentId = Number(req.body?.studentId);
      if (!Number.isInteger(studentId) || studentId < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid studentId',
        });
      }

      const challenge = await Challenge.findByPk(challengeId);
      if (!challenge) {
        return res
          .status(404)
          .json({ success: false, error: 'Challenge not found' });
      }
      if (
        challenge.status !== ChallengeStatus.STARTED_PHASE_TWO &&
        challenge.status !== ChallengeStatus.ENDED_PHASE_TWO
      ) {
        return res.status(409).json({
          success: false,
          error: 'Peer review tests can only be saved during peer review.',
        });
      }

      const participant = await ChallengeParticipant.findOne({
        where: { challengeId, studentId },
      });
      if (!participant) {
        return res.status(404).json({
          success: false,
          error: 'Participant not found for this challenge and student',
        });
      }

      const assignment = await PeerReviewAssignment.findOne({
        where: { id: assignmentId },
        include: [
          {
            model: Submission,
            as: 'submission',
            include: [
              {
                model: Match,
                as: 'match',
                include: [
                  {
                    model: ChallengeMatchSetting,
                    as: 'challengeMatchSetting',
                    where: { challengeId },
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!assignment || !assignment.submission) {
        return res.status(404).json({
          success: false,
          error: 'Peer review assignment not found',
        });
      }

      if (assignment.reviewerId !== participant.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this assignment',
        });
      }

      const normalizedTests = normalizeFeedbackTests(req.body?.tests);

      const updated = await assignment.update({
        feedbackTests: normalizedTests,
      });

      return res.json({
        success: true,
        data: {
          id: updated.id,
          feedbackTests: updated.feedbackTests || [],
        },
      });
    } catch (error) {
      handleException(res, error);
    }
  }
);
router.post('/challenges/:challengeId/peer-reviews/start', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const result = await startPeerReviewService({ challengeId });

    if (result.status === 'challenge_not_found') {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (result.status === 'invalid_status') {
      return res.status(409).json({
        success: false,
        error: 'Peer review can only start after the coding phase ends.',
        currentStatus: result.challengeStatus,
      });
    }

    if (result.status === 'finalization_pending') {
      return res.status(409).json({
        success: false,
        error: 'Submissions are still being finalized. Try again in a moment.',
        inFlightSubmissionsCount: result.inFlightSubmissionsCount,
      });
    }

    if (result.status === 'already_started') {
      return res.status(409).json({
        success: false,
        error: 'Peer review already started.',
      });
    }

    if (result.status === 'no_matches') {
      return res.status(400).json({
        success: false,
        error: 'No matches assigned for this challenge.',
      });
    }

    if (result.status === 'insufficient_valid_submissions') {
      return res.status(400).json({
        success: false,
        error:
          'Peer review cannot start because there are not enough valid submissions.',
      });
    }

    if (result.status === 'no_assignments') {
      return res.status(400).json({
        success: false,
        error:
          'Peer review cannot start because review assignments are missing.',
      });
    }

    if (result.status !== 'ok') {
      return res.status(500).json({
        success: false,
        error: 'Unable to start peer review.',
      });
    }

    const { challenge: updatedChallenge } = result;
    await schedulePhaseTwoEndForChallenge(updatedChallenge);
    emitChallengeUpdate(updatedChallenge);

    return res.json({
      success: true,
      challenge: {
        id: updatedChallenge.id,
        title: updatedChallenge.title,
        status: updatedChallenge.status,
        startPhaseTwoDateTime: updatedChallenge.startPhaseTwoDateTime,
        endPhaseTwoDateTime: updatedChallenge.endPhaseTwoDateTime,
        durationPeerReview: updatedChallenge.durationPeerReview,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});
router.post('/challenges/:challengeId/start', async (req, res) => {
  try {
    const { challengeId: challengeIdParam } = req.params;
    const challengeId = Number(challengeIdParam);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const result = await startChallengeService({ challengeId });

    if (result.status === 'challenge_not_found') {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (result.status === 'invalid_status') {
      return res.status(409).json({
        success: false,
        error: 'Challenge must be assigned before it can be started.',
        currentStatus: result.challengeStatus,
      });
    }

    if (result.status === 'too_early') {
      return res.status(400).json({
        success: false,
        error: 'Challenge cannot be started before its start time.',
      });
    }

    if (result.status === 'no_participants') {
      return res.status(400).json({
        success: false,
        error: 'No participants joined. Challenge cannot be started.',
      });
    }

    if (result.status === 'no_matches') {
      return res.status(400).json({
        success: false,
        error: 'No matches assigned. Challenge cannot be started.',
      });
    }

    if (result.status === 'already_started') {
      return res.status(409).json({
        success: false,
        error: 'Challenge already started.',
      });
    }

    if (result.status === 'participants_error') {
      return res.status(500).json({
        success: false,
        error: 'Unable to load participants.',
      });
    }

    if (result.status !== 'ok') {
      //for any unexpected status that we dont know
      return res.status(500).json({
        success: false,
        error: 'Unknown error starting challenge.',
      });
    }

    const { challenge } = result;
    await schedulePhaseOneEndForChallenge(challenge);
    emitChallengeUpdate(challenge);

    return res.json({
      success: true,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        status: challenge.status,
        startDatetime: challenge.startDatetime,
        duration: challenge.duration,
        startPhaseOneDateTime: challenge.startPhaseOneDateTime,
        endPhaseOneDateTime: challenge.endPhaseOneDateTime,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/challenges/:challengeId/end-coding', async (req, res) => {
  try {
    const { challengeId: challengeIdParam } = req.params;
    const challengeId = Number(challengeIdParam);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (challenge.status !== ChallengeStatus.STARTED_PHASE_ONE) {
      return res.status(409).json({
        success: false,
        error: 'Coding phase can only be ended while it is active.',
        currentStatus: challenge.status,
      });
    }

    const endPhaseOneDateTime = new Date();
    const [updatedCount, updatedRows] = await Challenge.update(
      {
        status: ChallengeStatus.ENDED_PHASE_ONE,
        endPhaseOneDateTime,
        phaseOneFinalizationCompletedAt: null,
      },
      {
        where: {
          id: challengeId,
          status: ChallengeStatus.STARTED_PHASE_ONE,
        },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return res.status(409).json({
        success: false,
        error: 'Coding phase could not be ended.',
      });
    }

    const updatedChallenge = updatedRows?.[0] || challenge;
    try {
      const finalizedMatches = await finalizeMissingSubmissionsForChallenge({
        challengeId: updatedChallenge.id,
      });
      finalizedMatches.forEach((finalized) => {
        broadcastEvent({
          event: 'finalization-updated',
          data: {
            challengeId: updatedChallenge.id,
            matchId: finalized.matchId,
          },
        });
      });
    } catch (error) {
      logger.error('Finalize missing submissions error:', error);
    }
    emitChallengeUpdate(updatedChallenge);

    try {
      await maybeCompletePhaseOneFinalization({
        challengeId: updatedChallenge.id,
      });
    } catch (error) {
      logger.error('Coding phase finalization completion error:', {
        challengeId: updatedChallenge.id,
        error: error?.message || String(error),
      });
    }

    return res.json({
      success: true,
      challenge: {
        id: updatedChallenge.id,
        title: updatedChallenge.title,
        status: updatedChallenge.status,
        endPhaseOneDateTime: updatedChallenge.endPhaseOneDateTime,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/challenges/:challengeId/end-peer-review', async (req, res) => {
  try {
    const { challengeId: challengeIdParam } = req.params;
    const challengeId = Number(challengeIdParam);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (challenge.status !== ChallengeStatus.STARTED_PHASE_TWO) {
      return res.status(409).json({
        success: false,
        error: 'Peer review can only be ended while it is active.',
        currentStatus: challenge.status,
      });
    }

    const result = await finalizePeerReviewChallenge({
      challengeId,
      allowEarly: true,
    });

    if (result.status === 'challenge_not_found') {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    if (result.status === 'no_participants') {
      return res.status(400).json({
        success: false,
        error: 'Peer review cannot be finalized without participants',
      });
    }

    if (result.status === 'update_failed') {
      return res.status(500).json({
        success: false,
        error: 'Unable to finalize peer review',
      });
    }

    if (result.status === 'ok' && result.challenge) {
      emitChallengeUpdate(result.challenge);
    }

    return res.json({
      success: true,
      data: { finalized: true },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/challenges/:challengeId/end-challenge', async (req, res) => {
  try {
    const { challengeId: challengeIdParam } = req.params;
    const challengeId = Number(challengeIdParam);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (challenge.status !== ChallengeStatus.ENDED_PHASE_ONE) {
      return res.status(409).json({
        success: false,
        error: 'Challenge can only be ended after the coding phase.',
        currentStatus: challenge.status,
      });
    }

    const result = await finalizePeerReviewChallenge({
      challengeId,
      allowEarly: true,
    });

    if (result.status === 'challenge_not_found') {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    if (result.status === 'no_participants') {
      return res.status(400).json({
        success: false,
        error: 'Challenge cannot be finalized without participants',
      });
    }

    if (result.status === 'update_failed') {
      return res.status(500).json({
        success: false,
        error: 'Unable to finalize challenge',
      });
    }

    if (result.status === 'ok' && result.challenge) {
      emitChallengeUpdate(result.challenge);
    }

    return res.json({
      success: true,
      data: { finalized: true },
    });
  } catch (error) {
    handleException(res, error);
  }
});
//read challenge data for joind student
router.get('/challenges/:challengeId/for-student', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challengeId',
      });
    }

    const studentId = Number(req.query.studentId);
    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid studentId',
      });
    }

    // check the student actually joined
    const participation = await ChallengeParticipant.findOne({
      where: { challengeId, studentId },
    });
    if (!participation) {
      return res.status(403).json({
        success: false,
        error: 'Student has not joined this challenge',
      });
    }
    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }
    if (shouldHidePrivate(req) && challenge.status === 'private') {
      return res.status(403).json({
        success: false,
        error: 'Challenge is private',
      });
    }
    return res.json({
      success: true,
      data: {
        id: challenge.id,
        status: challenge.status,
        startDatetime: challenge.startDatetime,
        duration: challenge.duration,
        startPhaseOneDateTime: challenge.startPhaseOneDateTime,
        startPhaseTwoDateTime: challenge.startPhaseTwoDateTime,
        endPhaseTwoDateTime: challenge.endPhaseTwoDateTime,
        durationPeerReview: challenge.durationPeerReview,
        title: challenge.title,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/challenges/:challengeId/custom-tests/run', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challengeId',
      });
    }

    const {
      studentId: rawStudentId,
      code,
      language = 'cpp',
      tests,
      input,
      expectedOutput,
    } = req.body;
    const studentId = Number(rawStudentId);
    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid studentId',
      });
    }
    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Code is required',
      });
    }

    const importValidationError = validateImportsBlock(code, language);
    if (importValidationError) {
      return res.status(400).json({
        success: false,
        error: importValidationError,
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }
    if (challenge.status !== ChallengeStatus.STARTED_PHASE_ONE) {
      return res.status(409).json({
        success: false,
        error: 'Custom tests are only available during the coding phase.',
      });
    }

    const participant = await ChallengeParticipant.findOne({
      where: { challengeId, studentId },
    });
    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Student has not joined this challenge',
      });
    }

    let rawTests = Array.isArray(tests) ? tests : [];
    if (rawTests.length === 0 && hasOwn(req.body, 'input')) {
      rawTests = [
        {
          input,
          output: hasOwn(req.body, 'expectedOutput') ? expectedOutput : null,
        },
      ];
    }

    const normalizedTests = normalizeCustomTests(rawTests);
    if (normalizedTests.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one custom test case is required.',
      });
    }

    const executionResult = await executeCodeTests({
      code,
      language,
      testCases: normalizedTests,
      userId: req.user?.id,
    });

    if (!executionResult.isCompiled) {
      const errorMessage =
        executionResult.errors?.[0]?.error || 'Compilation failed.';
      return res.status(400).json({
        success: false,
        error: errorMessage,
        results: executionResult.testResults,
      });
    }

    return res.json({
      success: true,
      data: {
        isCompiled: executionResult.isCompiled,
        isPassed: executionResult.isPassed,
        results: executionResult.testResults,
        summary: executionResult.summary,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});
//read Match(assigned matchsettng for joind student)
router.get('/challenges/:challengeId/matchSetting', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    const studentId = Number(req.query.studentId);

    if (!challengeId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'challengeId and studentId are required',
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }
    if (shouldHidePrivate(req) && challenge.status === 'private') {
      return res.status(403).json({
        success: false,
        message: 'Challenge is private',
      });
    }
    const canAccessMatchData = [
      ChallengeStatus.STARTED_PHASE_ONE,
      ChallengeStatus.ENDED_PHASE_ONE,
      ChallengeStatus.STARTED_PHASE_TWO,
      ChallengeStatus.ENDED_PHASE_TWO,
    ].includes(challenge.status);
    if (!canAccessMatchData) {
      return res.status(409).json({
        success: false,
        message: 'Challenge has not started yet.',
        status: challenge.status,
      });
    }

    const participant = await ChallengeParticipant.findOne({
      where: { challengeId, studentId },
    });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found for this challenge and student',
      });
    }

    const match = await Match.findOne({
      where: { challengeParticipantId: participant.id },
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found for the given participant',
      });
    }
    const challengeMatchSetting = await ChallengeMatchSetting.findOne({
      where: {
        id: match.challengeMatchSettingId,
      },
    });

    if (!challengeMatchSetting) {
      return res.status(404).json({
        success: false,
        message: 'ChallengeMatchSetting not found for the given match',
      });
    }

    const matchSetting = await MatchSetting.findOne({
      where: { id: challengeMatchSetting.matchSettingId },
    });

    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        message: 'MatchSetting not found for the given match',
      });
    }

    const matchRows = await Match.findAll({
      attributes: ['id'],
      where: { challengeMatchSettingId: challengeMatchSetting.id },
      raw: true,
    });
    const matchIds = matchRows.map((row) => row.id);
    let validSubmissionsCount = 0;
    if (matchIds.length > 0) {
      validSubmissionsCount = await Submission.count({
        where: {
          matchId: { [Op.in]: matchIds },
          isFinal: true,
          status: {
            [Op.in]: [
              SubmissionStatus.IMPROVABLE,
              SubmissionStatus.PROBABLY_CORRECT,
            ],
          },
        },
      });
    }

    const peerReviewBlocked =
      challenge.status === ChallengeStatus.ENDED_PHASE_ONE &&
      validSubmissionsCount <= 1;
    const peerReviewBlockedMessage = peerReviewBlocked
      ? 'Thanks for your effort. Peer review will not start because there are not enough submissions to review.'
      : null;

    return res.json({
      success: true,
      data: {
        ...matchSetting.toJSON(),
        validSubmissionsCount,
        peerReviewBlockedMessage,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

//read Match(assigned match for joind student)
router.get('/challenges/:challengeId/match', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    const studentId = Number(req.query.studentId);
    if (!challengeId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'challengeId and studentId are required',
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }
    if (shouldHidePrivate(req) && challenge.status === 'private') {
      return res.status(403).json({
        success: false,
        message: 'Challenge is private',
      });
    }
    const canAccessMatchData = [
      ChallengeStatus.STARTED_PHASE_ONE,
      ChallengeStatus.ENDED_PHASE_ONE,
      ChallengeStatus.STARTED_PHASE_TWO,
      ChallengeStatus.ENDED_PHASE_TWO,
    ].includes(challenge.status);
    if (!canAccessMatchData) {
      return res.status(409).json({
        success: false,
        message: 'Challenge has not started yet.',
        status: challenge.status,
      });
    }

    const participant = await ChallengeParticipant.findOne({
      where: { challengeId, studentId },
    });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found for this challenge and student',
      });
    }

    const match = await Match.findOne({
      where: { challengeParticipantId: participant.id },
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found for the given participant',
      });
    }
    return res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/challenges/:challengeId/results', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    const studentId = Number(req.query.studentId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challengeId',
      });
    }
    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid studentId',
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }
    if (!isEndedStatus(challenge.status)) {
      return res.status(409).json({
        success: false,
        error: 'Challenge has not ended yet.',
      });
    }

    const participant = await ChallengeParticipant.findOne({
      where: { challengeId, studentId },
    });
    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Student has not joined this challenge',
      });
    }

    const match = await Match.findOne({
      where: { challengeParticipantId: participant.id },
      include: [
        {
          model: ChallengeMatchSetting,
          as: 'challengeMatchSetting',
          include: [{ model: MatchSetting, as: 'matchSetting' }],
        },
      ],
    });
    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found for this student',
      });
    }

    const totalMatches = await Match.count({
      include: [
        {
          model: ChallengeMatchSetting,
          as: 'challengeMatchSetting',
          required: true,
          where: { challengeId },
        },
      ],
    });

    const finalSubmissionCount = await Submission.count({
      distinct: true,
      col: 'match_id',
      where: { isFinal: true },
      include: [
        {
          model: Match,
          as: 'match',
          required: true,
          attributes: [],
          include: [
            {
              model: ChallengeMatchSetting,
              as: 'challengeMatchSetting',
              required: true,
              attributes: [],
              where: { challengeId },
            },
          ],
        },
      ],
    });

    const inFlightSubmissionsCount = getInFlightSubmissionsCount(challengeId);
    const pendingFinalCount = Math.max(0, totalMatches - finalSubmissionCount);
    const withinAutosubmitGrace = (() => {
      if (challenge.status !== ChallengeStatus.ENDED_PHASE_ONE) return false;
      if (!PHASE_ONE_AUTOSUBMIT_GRACE_MS) return false;
      if (!challenge.endPhaseOneDateTime) return false;
      const endMs = new Date(challenge.endPhaseOneDateTime).getTime();
      if (Number.isNaN(endMs)) return false;
      return Date.now() - endMs < PHASE_ONE_AUTOSUBMIT_GRACE_MS;
    })();
    const gracePendingCount = withinAutosubmitGrace ? 1 : 0;
    const pendingFinalizationCount =
      challenge.status === ChallengeStatus.ENDED_PHASE_ONE
        ? pendingFinalCount + inFlightSubmissionsCount + gracePendingCount
        : pendingFinalCount;
    const resultsReady = pendingFinalizationCount === 0;

    let studentSubmission = await Submission.findOne({
      where: { matchId: match.id, isFinal: true },
      order: [
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    if (!studentSubmission) {
      studentSubmission = await Submission.findOne({
        where: { matchId: match.id },
        order: [
          ['updatedAt', 'DESC'],
          ['id', 'DESC'],
        ],
      });
    }

    const manualSubmission = await Submission.findOne({
      where: { matchId: match.id, isAutomaticSubmission: false },
      order: [
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    const automaticSubmission = await Submission.findOne({
      where: { matchId: match.id, isAutomaticSubmission: true },
      order: [
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    const submissionSummary = {
      hasManualSubmission: Boolean(manualSubmission),
      hasAutomaticSubmission: Boolean(automaticSubmission),
      automaticStatus: automaticSubmission?.status || null,
      finalIsAutomatic: studentSubmission?.isAutomaticSubmission === true,
    };

    const phaseTwoEndTimestamp = challenge.endPhaseTwoDateTime
      ? new Date(challenge.endPhaseTwoDateTime).getTime()
      : null;
    const hasPhaseTwoEnded =
      phaseTwoEndTimestamp !== null
        ? phaseTwoEndTimestamp <= Date.now()
        : false;
    const isFullyEnded =
      challenge.status === ChallengeStatus.ENDED_PHASE_TWO && hasPhaseTwoEnded;
    let otherSubmissions = [];
    if (isFullyEnded) {
      const submissions = await Submission.findAll({
        where: { isFinal: true },
        include: [
          {
            model: Match,
            as: 'match',
            where: { challengeMatchSettingId: match.challengeMatchSettingId },
            attributes: ['id', 'challengeMatchSettingId'],
          },
          {
            model: ChallengeParticipant,
            as: 'challengeParticipant',
            attributes: ['id'],
            include: [
              { model: User, as: 'student', attributes: ['id', 'username'] },
            ],
          },
        ],
        order: [
          ['updatedAt', 'DESC'],
          ['id', 'DESC'],
        ],
      });

      otherSubmissions = submissions
        .filter(
          (submission) => submission.challengeParticipantId !== participant.id
        )
        .map((submission) => ({
          id: submission.id,
          code: submission.code,
          createdAt: submission.createdAt,
          matchId: submission.matchId,
          student: submission.challengeParticipant?.student
            ? {
                id: submission.challengeParticipant.student.id,
                username: submission.challengeParticipant.student.username,
              }
            : null,
        }));
    }

    let peerReviewTests = [];
    let scoreBreakdown = null;
    if (isFullyEnded && studentSubmission) {
      scoreBreakdown = await SubmissionScoreBreakdown.findOne({
        where: { submissionId: studentSubmission.id },
      });

      const assignments = await PeerReviewAssignment.findAll({
        where: { submissionId: studentSubmission.id },
        include: [
          {
            model: ChallengeParticipant,
            as: 'reviewer',
            attributes: ['id'],
            include: [
              { model: User, as: 'student', attributes: ['id', 'username'] },
            ],
          },
        ],
      });
      peerReviewTests = assignments.map((assignment) => ({
        id: assignment.id,
        reviewer: assignment.reviewer?.student
          ? {
              id: assignment.reviewer.student.id,
              username: assignment.reviewer.student.username,
            }
          : null,
        tests: assignment.feedbackTests || [],
      }));
    }
    const challengeBadgeStatus = await awardChallengeMilestoneBadges(studentId);
    // Award and return review badges only after peer review is finalized and vote
    // results (e.g. is_vote_correct) are registered in the database.
    let reviewMilestoneBadges = [];
    let reviewQualityBadges = [];
    let reviewBadgesAlreadyEarned = [];
    if (challenge.scoringStatus === 'completed') {
      const milestone = await awardReviewMilestoneBadges(studentId);
      const quality = await awardReviewQualityBadges(studentId);
      reviewMilestoneBadges = milestone.newlyUnlocked;
      reviewQualityBadges = quality.newlyUnlocked;
      // Include review badges already earned (e.g. from finalize) so the result
      // page modal can show them; they are not "newly created" here.
      const phaseTwoEnd = challenge.endPhaseTwoDateTime
        ? new Date(challenge.endPhaseTwoDateTime)
        : null;
      reviewBadgesAlreadyEarned = await getReviewBadgesEarnedSince(
        studentId,
        phaseTwoEnd
      );
    }
    const reviewFromAward = [...reviewMilestoneBadges, ...reviewQualityBadges];
    const awardIds = new Set(reviewFromAward.map((b) => b.id));
    const extraReview = reviewBadgesAlreadyEarned.filter(
      (b) => !awardIds.has(b.id)
    );
    const badgeStatus = {
      ...challengeBadgeStatus,
      newlyUnlocked: [
        ...challengeBadgeStatus.newlyUnlocked,
        ...reviewFromAward,
        ...extraReview,
      ],
    };
    logger.info(`BadgeStatus for student ${studentId}: ${badgeStatus}`);
    return res.json({
      success: true,
      data: {
        challenge: {
          id: challenge.id,
          title: challenge.title,
          status: challenge.status,
          endPhaseTwoDateTime: challenge.endPhaseTwoDateTime,
          scoringStatus: challenge.scoringStatus,
        },
        matchSetting: match.challengeMatchSetting?.matchSetting
          ? {
              id: match.challengeMatchSetting.matchSetting.id,
              problemTitle:
                match.challengeMatchSetting.matchSetting.problemTitle,
            }
          : null,
        studentSubmission: studentSubmission
          ? {
              id: studentSubmission.id,
              code: studentSubmission.code,
              status: studentSubmission.status,
              isAutomaticSubmission: studentSubmission.isAutomaticSubmission,
              isFinal: studentSubmission.isFinal,
              publicTestResults: parseTestResults(
                studentSubmission.publicTestResults
              ),
              privateTestResults: parseTestResults(
                studentSubmission.privateTestResults
              ),
              createdAt: studentSubmission.createdAt,
            }
          : null,
        submissionSummary,
        finalization: {
          totalMatches,
          finalSubmissionCount,
          pendingFinalCount: pendingFinalizationCount,
          resultsReady,
          inFlightSubmissionsCount,
          phaseOneFinalizationCompletedAt:
            challenge.phaseOneFinalizationCompletedAt,
        },
        otherSubmissions,
        peerReviewTests,
        scoreBreakdown,
        badges: {
          completedChallenges: badgeStatus.completedChallenges,
          newlyUnlocked: badgeStatus.newlyUnlocked,
        },
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/challenges/:challengeId/teacher-results', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challengeId',
      });
    }

    if (!isPrivilegedRole(getRequestRole(req))) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access teacher results.',
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }
    if (!isEndedStatus(challenge.status)) {
      return res.status(409).json({
        success: false,
        error: 'Challenge has not ended yet.',
      });
    }

    const includePeerReviewResults =
      String(req.query.includePeerReviewResults).toLowerCase() === 'true';

    const matches = await Match.findAll({
      include: [
        {
          model: ChallengeMatchSetting,
          as: 'challengeMatchSetting',
          where: { challengeId },
          include: [{ model: MatchSetting, as: 'matchSetting' }],
        },
        {
          model: ChallengeParticipant,
          as: 'challengeParticipant',
          include: [{ model: User, as: 'student' }],
        },
      ],
      order: [
        [{ model: ChallengeMatchSetting, as: 'challengeMatchSetting' }, 'id'],
        ['id', 'ASC'],
      ],
    });

    const matchIds = matches.map((matchRow) => matchRow.id);
    const submissions =
      matchIds.length > 0
        ? await Submission.findAll({
            where: { matchId: { [Op.in]: matchIds } },
            order: [
              ['isFinal', 'DESC'],
              ['updatedAt', 'DESC'],
              ['id', 'DESC'],
            ],
          })
        : [];

    const submissionByMatchId = new Map();
    submissions.forEach((submission) => {
      if (!submissionByMatchId.has(submission.matchId)) {
        submissionByMatchId.set(submission.matchId, submission);
      }
    });

    const submissionsById = new Map(
      Array.from(submissionByMatchId.values()).map((submission) => [
        submission.id,
        submission,
      ])
    );
    const submissionIds = Array.from(submissionsById.keys());

    const assignments =
      submissionIds.length > 0
        ? await PeerReviewAssignment.findAll({
            where: { submissionId: { [Op.in]: submissionIds } },
            include: [
              {
                model: ChallengeParticipant,
                as: 'reviewer',
                include: [{ model: User, as: 'student' }],
              },
              {
                model: PeerReviewVote,
                as: 'vote',
              },
            ],
          })
        : [];

    const assignmentsBySubmissionId = new Map();
    assignments.forEach((assignment) => {
      const submissionId = assignment.submissionId;
      if (!assignmentsBySubmissionId.has(submissionId)) {
        assignmentsBySubmissionId.set(submissionId, []);
      }
      assignmentsBySubmissionId.get(submissionId).push(assignment);
    });

    const testResultsByAssignmentId = new Map();
    if (includePeerReviewResults && assignments.length > 0) {
      for (const [
        submissionId,
        submissionAssignments,
      ] of assignmentsBySubmissionId) {
        const submission = submissionsById.get(submissionId);
        if (!submission?.code) continue;

        const testCases = [];
        const assignmentIds = [];

        submissionAssignments.forEach((assignment) => {
          const vote = assignment.vote;
          if (!vote?.testCaseInput || !vote?.expectedOutput) return;
          const inputValue = parseJsonValue(vote.testCaseInput);
          const outputValue = parseJsonValue(vote.expectedOutput);
          testCases.push({ input: inputValue, output: outputValue });
          assignmentIds.push(assignment.id);
        });

        if (testCases.length === 0) continue;

        try {
          const executionResult = await executeCodeTests({
            code: submission.code,
            language: 'cpp',
            testCases,
            userId: getRequestUser(req)?.id,
          });

          executionResult?.testResults?.forEach((result, index) => {
            const assignmentId = assignmentIds[index];
            if (!assignmentId) return;
            testResultsByAssignmentId.set(assignmentId, {
              passed: result.passed,
              actualOutput: result.actualOutput,
              expectedOutput: result.expectedOutput,
              error: result.error || result.stderr || null,
              exitCode: result.exitCode,
            });
          });
        } catch (error) {
          assignmentIds.forEach((assignmentId) => {
            testResultsByAssignmentId.set(assignmentId, {
              passed: false,
              actualOutput: null,
              expectedOutput: null,
              error:
                error?.message ||
                'Unable to run the submitted peer review test.',
              exitCode: -1,
            });
          });
        }
      }
    }

    const grouped = {};
    matches.forEach((matchRow) => {
      const cmsId = matchRow.challengeMatchSettingId;
      if (!grouped[cmsId]) {
        grouped[cmsId] = {
          challengeMatchSettingId: cmsId,
          matchSetting: matchRow.challengeMatchSetting?.matchSetting
            ? {
                id: matchRow.challengeMatchSetting.matchSetting.id,
                problemTitle:
                  matchRow.challengeMatchSetting.matchSetting.problemTitle,
              }
            : null,
          matches: [],
        };
      }

      const submission = submissionByMatchId.get(matchRow.id);
      const assignmentsForSubmission = submission
        ? assignmentsBySubmissionId.get(submission.id) || []
        : [];

      grouped[cmsId].matches.push({
        id: matchRow.id,
        student: matchRow.challengeParticipant?.student
          ? {
              id: matchRow.challengeParticipant.student.id,
              username: matchRow.challengeParticipant.student.username,
              firstName: matchRow.challengeParticipant.student.firstName,
              lastName: matchRow.challengeParticipant.student.lastName,
              email: matchRow.challengeParticipant.student.email,
            }
          : null,
        submission: submission
          ? {
              id: submission.id,
              code: submission.code,
              status: submission.status,
              isFinal: submission.isFinal,
              publicTestResults: parseTestResults(submission.publicTestResults),
              privateTestResults: parseTestResults(
                submission.privateTestResults
              ),
              createdAt: submission.createdAt,
              updatedAt: submission.updatedAt,
            }
          : null,
        peerReviewAssignments: assignmentsForSubmission.map((assignment) => ({
          id: assignment.id,
          isExtra: assignment.isExtra,
          feedbackTests: assignment.feedbackTests || [],
          reviewer: assignment.reviewer?.student
            ? {
                id: assignment.reviewer.student.id,
                username: assignment.reviewer.student.username,
                firstName: assignment.reviewer.student.firstName,
                lastName: assignment.reviewer.student.lastName,
                email: assignment.reviewer.student.email,
              }
            : null,
          vote: assignment.vote
            ? {
                id: assignment.vote.id,
                vote: assignment.vote.vote,
                testCaseInput: assignment.vote.testCaseInput,
                expectedOutput: assignment.vote.expectedOutput,
                actualOutput: assignment.vote.actualOutput,
                referenceOutput: assignment.vote.referenceOutput,
                isExpectedOutputCorrect:
                  assignment.vote.isExpectedOutputCorrect,
                isBugProven: assignment.vote.isBugProven,
                isVoteCorrect: assignment.vote.isVoteCorrect,
                evaluationStatus: assignment.vote.evaluationStatus,
                createdAt: assignment.vote.createdAt,
              }
            : null,
          testExecution: testResultsByAssignmentId.get(assignment.id) || null,
        })),
      });
    });

    return res.json({
      success: true,
      data: {
        challenge: {
          id: challenge.id,
          status: challenge.status,
          title: challenge.title,
        },
        matchSettings: Object.values(grouped),
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post(
  '/challenges/:challengeId/match-settings/:matchSettingId/private-tests',
  async (req, res) => {
    try {
      const challengeId = Number(req.params.challengeId);
      const matchSettingId = Number(req.params.matchSettingId);
      if (!Number.isInteger(challengeId) || challengeId < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid challengeId',
        });
      }
      if (!Number.isInteger(matchSettingId) || matchSettingId < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid matchSettingId',
        });
      }
      if (!isPrivilegedRole(getRequestRole(req))) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update private tests.',
        });
      }

      const challenge = await Challenge.findByPk(challengeId);
      if (!challenge) {
        return res
          .status(404)
          .json({ success: false, error: 'Challenge not found' });
      }
      if (!isEndedStatus(challenge.status)) {
        return res.status(409).json({
          success: false,
          error: 'Challenge has not ended yet.',
        });
      }

      const cms = await ChallengeMatchSetting.findOne({
        where: { challengeId, matchSettingId },
      });
      if (!cms) {
        return res.status(404).json({
          success: false,
          error: 'Match setting not found for this challenge',
        });
      }

      const matchSetting = await MatchSetting.findByPk(matchSettingId);
      if (!matchSetting) {
        return res.status(404).json({
          success: false,
          error: 'Match setting not found',
        });
      }

      const assignmentId = Number(req.body?.assignmentId);
      if (!Number.isInteger(assignmentId) || assignmentId < 1) {
        return res.status(400).json({
          success: false,
          error: 'assignmentId is required to validate the peer review test.',
        });
      }

      const assignment = await PeerReviewAssignment.findOne({
        where: { id: assignmentId },
        include: [
          {
            model: Submission,
            as: 'submission',
            include: [
              {
                model: Match,
                as: 'match',
                include: [
                  {
                    model: ChallengeMatchSetting,
                    as: 'challengeMatchSetting',
                    where: { challengeId, matchSettingId },
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            model: PeerReviewVote,
            as: 'vote',
          },
        ],
      });

      if (!assignment?.submission) {
        return res.status(404).json({
          success: false,
          error: 'Peer review assignment not found for this match setting.',
        });
      }

      const vote = assignment.vote;
      if (!vote || vote.vote !== VoteType.INCORRECT) {
        return res.status(400).json({
          success: false,
          error:
            'Only incorrect peer review votes can be added to private tests.',
        });
      }

      if (!vote.testCaseInput || !vote.expectedOutput) {
        return res.status(400).json({
          success: false,
          error: 'Peer review test case is missing input or expected output.',
        });
      }

      const parsedInput = parseJsonValueStrict(vote.testCaseInput, 'Input');
      if (!parsedInput.ok) {
        return res.status(400).json({
          success: false,
          error: parsedInput.error,
        });
      }
      const parsedOutput = parseJsonValueStrict(vote.expectedOutput, 'Output');
      if (!parsedOutput.ok) {
        return res.status(400).json({
          success: false,
          error: parsedOutput.error,
        });
      }

      if (!matchSetting.referenceSolution) {
        return res.status(400).json({
          success: false,
          error:
            'Reference solution is required to validate peer review tests.',
        });
      }

      try {
        const referenceResult = await runReferenceSolution({
          referenceSolution: matchSetting.referenceSolution,
          testCaseInput: JSON.stringify(parsedInput.value),
        });
        const normalizedExpected = normalizeOutputForComparison(
          parsedOutput.value
        );
        const normalizedReference = normalizeOutputForComparison(
          referenceResult.referenceOutput
        );

        if (normalizedExpected !== normalizedReference) {
          return res.status(400).json({
            success: false,
            error: 'Expected output does not match the reference solution.',
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          error:
            error?.message ||
            'Unable to validate the peer review test against the reference solution.',
        });
      }

      const privateTests = Array.isArray(matchSetting.privateTests)
        ? matchSetting.privateTests
        : [];
      const newTestCase = {
        input: parsedInput.value,
        output: parsedOutput.value,
      };

      const alreadyExists = privateTests.some((testCase) => {
        if (!testCase) return false;
        return (
          JSON.stringify(testCase.input) ===
            JSON.stringify(newTestCase.input) &&
          JSON.stringify(testCase.output) === JSON.stringify(newTestCase.output)
        );
      });

      if (!alreadyExists) {
        await matchSetting.update({
          privateTests: [...privateTests, newTestCase],
        });
      }

      return res.json({
        success: true,
        data: {
          matchSettingId: matchSetting.id,
          added: !alreadyExists,
          privateTests: matchSetting.privateTests,
        },
      });
    } catch (error) {
      handleException(res, error);
    }
  }
);

router.post('/challenges/:challengeId/publish', async (req, res) => {
  let transaction;
  try {
    const toIsoString = (value) =>
      value instanceof Date ? value.toISOString() : value;
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    transaction = await sequelize.transaction();
    const challenge = await Challenge.findByPk(challengeId, {
      include: [
        {
          model: MatchSetting,
          as: 'matchSettings',
          through: { attributes: [] },
        },
      ],
      transaction,
    });
    if (!challenge) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (challenge.status === ChallengeStatus.PUBLIC) {
      await transaction.commit();
      return res.json({ success: true, challenge });
    }

    if (challenge.status !== ChallengeStatus.PRIVATE) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        error: 'Challenge can only be published from private status.',
      });
    }

    const matchSettingIds = (challenge.matchSettings || [])
      .map((setting) => setting?.id)
      .filter((id) => Number.isInteger(id));
    if (matchSettingIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: { message: 'At least one match setting is required.' },
      });
    }

    const payload = {
      title: challenge.title,
      duration: challenge.duration,
      startDatetime: toIsoString(challenge.startDatetime),
      endDatetime: toIsoString(challenge.endDatetime),
      durationPeerReview: challenge.durationPeerReview,
      allowedNumberOfReview: challenge.allowedNumberOfReview ?? 5,
      status: ChallengeStatus.PUBLIC,
      matchSettingIds,
    };

    await validateChallengeData(payload, {
      validatorKey: 'challenge-public',
    });

    const overlappingChallenge = await Challenge.findOne({
      where: {
        id: { [Op.ne]: challengeId },
        status: ChallengeStatus.PUBLIC,
        startDatetime: { [Op.lt]: payload.endDatetime },
        endDatetime: { [Op.gt]: payload.startDatetime },
      },
      transaction,
    });
    if (overlappingChallenge) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: 'Challenge time overlaps with an existing challenge.',
          code: 'challenge_overlap',
        },
      });
    }

    await challenge.update({ status: ChallengeStatus.PUBLIC }, { transaction });
    await transaction.commit();
    emitChallengeUpdate(challenge);
    return res.json({ success: true, challenge });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Failed to rollback challenge publish transaction', {
          rollbackError,
        });
      }
    }
    handleException(res, error);
  }
});

router.post('/challenges/:challengeId/unpublish', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId, { transaction });
    if (!challenge) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (challenge.status === ChallengeStatus.PRIVATE) {
      await transaction.commit();
      return res.json({ success: true, challenge });
    }

    if (challenge.status !== ChallengeStatus.PUBLIC) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        error: 'Challenge can only be unpublished before it starts.',
      });
    }

    await ChallengeParticipant.destroy({
      where: { challengeId: challenge.id },
      transaction,
    });
    await challenge.update(
      { status: ChallengeStatus.PRIVATE },
      { transaction }
    );
    await transaction.commit();
    emitChallengeUpdate(challenge);

    return res.json({ success: true, challenge });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Failed to rollback challenge unpublish transaction', {
          rollbackError,
        });
      }
    }
    handleException(res, error);
  }
});

router.patch('/challenges/:challengeId', async (req, res) => {
  const trimmedTitle =
    typeof req.body.title === 'string' ? req.body.title.trim() : req.body.title;
  const payload = {
    title: trimmedTitle,
    duration: req.body.duration,
    startDatetime: req.body.startDatetime,
    endDatetime: req.body.endDatetime,
    durationPeerReview: req.body.durationPeerReview,
    allowedNumberOfReview: req.body.allowedNumberOfReview,
    status: req.body.status,
    matchSettingIds: req.body.matchSettingIds,
  };
  const matchSettingIds = Array.isArray(req.body.matchSettingIds)
    ? req.body.matchSettingIds
    : [];
  let transaction;
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (challenge.status !== ChallengeStatus.PRIVATE) {
      return res.status(409).json({
        success: false,
        error: 'Challenge must be private to be edited. Unpublish it first.',
        currentStatus: challenge.status,
      });
    }

    payload.status = req.body.status || challenge.status;
    payload.allowedNumberOfReview =
      req.body.allowedNumberOfReview ?? challenge.allowedNumberOfReview ?? 5;
    payload.matchSettingIds = matchSettingIds;

    if (matchSettingIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'At least one match setting is required.' },
      });
    }

    await validateChallengeData(payload, { validatorKey: 'challenge' });

    const start = new Date(payload.startDatetime);
    const end = new Date(payload.endDatetime);
    const durationInMs = payload.duration * 60 * 1000;
    const windowInMs = end.getTime() - start.getTime();

    if (windowInMs < durationInMs) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            'The time window (endDatetime - startDatetime) must be greater than or equal to the duration.',
        },
      });
    }

    const settings = await MatchSetting.findAll({
      where: { id: matchSettingIds },
    });
    if (settings.length !== matchSettingIds.length) {
      const foundIds = settings.map((setting) => setting.id);
      const missingIds = matchSettingIds.filter((id) => !foundIds.includes(id));
      return res.status(400).json({
        success: false,
        error: {
          message: 'One or more match settings not found.',
          missingIds,
        },
      });
    }

    if (payload.status === ChallengeStatus.PUBLIC) {
      const overlappingChallenge = await Challenge.findOne({
        where: {
          id: { [Op.ne]: challengeId },
          status: ChallengeStatus.PUBLIC,
          startDatetime: { [Op.lt]: payload.endDatetime },
          endDatetime: { [Op.gt]: payload.startDatetime },
        },
      });

      const allowOverlap = Boolean(req.body.allowOverlap);
      if (overlappingChallenge && !allowOverlap) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Challenge time overlaps with an existing challenge.',
            code: 'challenge_overlap',
          },
        });
      }
      if (overlappingChallenge && allowOverlap) {
        payload.status = ChallengeStatus.PRIVATE;
      }
    }

    transaction = await sequelize.transaction();
    await challenge.update(
      {
        title: payload.title,
        duration: payload.duration,
        startDatetime: payload.startDatetime,
        endDatetime: payload.endDatetime,
        durationPeerReview: payload.durationPeerReview,
        allowedNumberOfReview: payload.allowedNumberOfReview,
        status: payload.status || challenge.status,
      },
      { transaction }
    );
    await challenge.setMatchSettings(settings, { transaction });
    await transaction.commit();

    const updatedChallenge = await Challenge.findByPk(challengeId, {
      include: [
        {
          model: MatchSetting,
          as: 'matchSettings',
          through: { attributes: [] },
        },
      ],
    });
    emitChallengeUpdate(updatedChallenge);
    return res.json({ success: true, challenge: updatedChallenge });
  } catch (error) {
    if (transaction) await transaction.rollback();
    handleException(res, error);
  }
});

router.get('/challenges/:challengeId', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId, {
      include: [
        {
          model: MatchSetting,
          as: 'matchSettings',
          through: { attributes: [] },
        },
      ],
    });

    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }
    const requestUser = getRequestUser(req);
    if (!requestUser && challenge.status === ChallengeStatus.PRIVATE) {
      return res.status(401).json({
        success: false,
        error: 'Not logged in',
      });
    }
    if (
      shouldHidePrivate(req) &&
      challenge.status === ChallengeStatus.PRIVATE
    ) {
      return res.status(403).json({
        success: false,
        error: 'Challenge is private',
      });
    }

    const challengeData = challenge.toJSON();
    const matchSettingIds = Array.isArray(challengeData.matchSettings)
      ? challengeData.matchSettings.map((matchSetting) => matchSetting.id)
      : [];

    return res.json({
      success: true,
      challenge: {
        ...challengeData,
        matchSettingIds,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/challenges/:challengeId/scoring-status', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId, {
      attributes: ['id', 'status', 'endPhaseTwoDateTime', 'scoringStatus'],
    });

    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (
      shouldHidePrivate(req) &&
      challenge.status === ChallengeStatus.PRIVATE
    ) {
      return res
        .status(403)
        .json({ success: false, error: 'Challenge is private' });
    }

    const now = new Date();
    const peerReviewEnd = challenge.endPhaseTwoDateTime
      ? new Date(challenge.endPhaseTwoDateTime)
      : null;

    if (!peerReviewEnd || now < peerReviewEnd) {
      return res.json({
        state: Scoring_Availability.PEER_REVIEW_NOT_ENDED,
        message:
          'Scoring is not available yet. Please wait until the peer review phase has ended.',
        canAccessData: false,
      });
    }

    if (challenge.scoringStatus !== 'completed') {
      return res.json({
        state: Scoring_Availability.SCORING_IN_PROGRESS,
        message:
          'Scoring is not available yet. Please wait until scoring is computed.',
        canAccessData: false,
      });
    }

    return res.json({
      state: Scoring_Availability.READY,
      message: null,
      canAccessData: true,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/challenges/:challengeId/leaderboard', async (req, res) => {
  try {
    const challengeId = Number(req.params.challengeId);
    if (!Number.isInteger(challengeId) || challengeId < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid challengeId' });
    }

    const challenge = await Challenge.findByPk(challengeId, {
      attributes: [
        'id',
        'title',
        'status',
        'endPhaseTwoDateTime',
        'scoringStatus',
      ],
    });
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: 'Challenge not found' });
    }

    if (
      shouldHidePrivate(req) &&
      challenge.status === ChallengeStatus.PRIVATE
    ) {
      return res.status(403).json({
        success: false,
        error: 'Challenge is private',
      });
    }

    const scoringReady =
      challenge.status === ChallengeStatus.ENDED_PHASE_TWO &&
      challenge.scoringStatus === 'completed';

    if (!scoringReady) {
      return res.json({
        success: true,
        data: {
          challenge: {
            id: challenge.id,
            title: challenge.title,
            scoringStatus: challenge.scoringStatus,
          },
          summary: {
            totalParticipants: 0,
            averageScore: 0,
            yourRank: null,
          },
          leaderboard: [],
          personalSummary: null,
        },
      });
    }

    const scoreRows = await SubmissionScoreBreakdown.findAll({
      include: [
        {
          model: Submission,
          as: 'submission',
          attributes: ['id', 'challengeParticipantId'],
          required: true,
          include: [
            {
              model: ChallengeParticipant,
              as: 'challengeParticipant',
              attributes: ['id', 'studentId', 'challengeId'],
              required: true,
              where: { challengeId },
              include: [
                {
                  model: User,
                  as: 'student',
                  attributes: ['id', 'username', 'titleId'],
                  include: [
                    {
                      model: Title,
                      as: 'title',
                      attributes: ['id', 'name'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const safeNumber = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const normalizeName = (value) =>
      typeof value === 'string' ? value.toLowerCase() : '';

    const entries = scoreRows
      .map((row) => {
        const submission = row.submission;
        const participant = submission?.challengeParticipant;
        const student = participant?.student;
        if (!student || !participant) return null;
        return {
          submissionId: submission.id,
          participantId: participant.id,
          studentId: student.id,
          username: student.username,
          skillTitle: student.title?.name || null,
          totalScore: safeNumber(row.totalScore),
          implementationScore: safeNumber(row.implementationScore),
          codeReviewScore: safeNumber(row.codeReviewScore),
        };
      })
      .filter(Boolean);

    entries.sort((a, b) => {
      const totalDiff = safeNumber(b.totalScore) - safeNumber(a.totalScore);
      if (totalDiff !== 0) return totalDiff;
      const nameDiff = normalizeName(a.username).localeCompare(
        normalizeName(b.username)
      );
      if (nameDiff !== 0) return nameDiff;
      return safeNumber(a.studentId) - safeNumber(b.studentId);
    });

    const requestUser = getRequestUser(req);
    const requestUserIdRaw = req.query?.studentId ?? requestUser?.id ?? null;
    const requestUserId = Number(requestUserIdRaw);
    const requestUserIdFinal = Number.isFinite(requestUserId)
      ? requestUserId
      : null;
    const studentIds = Array.from(
      new Set(entries.map((entry) => entry.studentId))
    );

    const studentBadges = studentIds.length
      ? await StudentBadge.findAll({
          where: { studentId: { [Op.in]: studentIds } },
          include: [
            {
              model: Badge,
              as: 'badge',
              attributes: ['key', 'name', 'iconKey', 'level', 'category'],
            },
          ],
        })
      : [];

    const badgesByStudent = new Map();
    studentBadges.forEach((row) => {
      const badge = row.badge;
      if (!badge) return;
      const list = badgesByStudent.get(row.studentId) ?? [];
      list.push({
        key: badge.key,
        name: badge.name,
        iconKey: badge.iconKey,
        level: badge.level,
        category: badge.category,
      });
      badgesByStudent.set(row.studentId, list);
    });

    const leaderboard = entries.map((entry, index) => {
      const rank = index + 1;
      const previous = index > 0 ? entries[index - 1] : null;
      const gapFromPrevious =
        previous && previous.totalScore !== null
          ? Math.max(
              0,
              safeNumber(previous.totalScore) - safeNumber(entry.totalScore)
            )
          : null;
      return {
        ...entry,
        rank,
        gapFromPrevious,
        isCurrentUser: requestUserIdFinal
          ? Number(entry.studentId) === Number(requestUserIdFinal)
          : false,
        skillTitle: entry.skillTitle ?? null,
        badges: badgesByStudent.get(entry.studentId) ?? [],
      };
    });

    const totalParticipants = leaderboard.length;
    const averageScoreRaw =
      totalParticipants > 0
        ? leaderboard.reduce(
            (sum, row) => sum + safeNumber(row.totalScore),
            0
          ) / totalParticipants
        : 0;
    const averageScore = Number(averageScoreRaw.toFixed(1));

    const currentRow = requestUserIdFinal
      ? leaderboard.find(
          (row) => Number(row.studentId) === Number(requestUserIdFinal)
        )
      : null;

    const personalSummary = currentRow
      ? {
          studentId: currentRow.studentId,
          rank: currentRow.rank,
          totalScore: currentRow.totalScore,
          implementationScore: currentRow.implementationScore,
          codeReviewScore: currentRow.codeReviewScore,
          gapToPrevious: currentRow.gapFromPrevious,
        }
      : null;

    return res.json({
      success: true,
      data: {
        challenge: {
          id: challenge.id,
          title: challenge.title,
          scoringStatus: challenge.scoringStatus,
        },
        summary: {
          totalParticipants,
          averageScore,
          yourRank: currentRow?.rank ?? null,
        },
        leaderboard,
        personalSummary,
      },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post(
  '/challenges/:challengeId/test-scoring-manual',
  async (req, res) => {
    try {
      const challengeId = Number(req.params.challengeId);
      console.log(`Manual trigger scoring for challenge ${challengeId}...`);

      const scores = await calculateChallengeScores(challengeId);

      if (scores && scores.length > 0) {
        await Promise.all(
          scores.map(async (scoreItem) => {
            if (scoreItem.submissionId) {
              const [breakdown, created] =
                await SubmissionScoreBreakdown.findOrCreate({
                  where: { submissionId: scoreItem.submissionId },
                  defaults: {
                    codeReviewScore: scoreItem.codeReviewScore,
                    implementationScore: 0,
                    totalScore: 0,
                  },
                });
              if (!created) {
                await breakdown.update({
                  codeReviewScore: scoreItem.codeReviewScore,
                });
              }
            }
          })
        );
      }

      return res.json({
        success: true,
        message: 'Calculation executed',
        results: scores,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
