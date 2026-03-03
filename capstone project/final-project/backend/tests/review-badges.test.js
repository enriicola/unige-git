import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import modelsInit from '#root/models/init-models.js';
import { Op } from 'sequelize';

import User from '#root/models/user.js';
import Badge from '#root/models/badge.js';
import Challenge from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import StudentBadge from '#root/models/student-badges.js';

import {
  awardReviewMilestoneBadges,
  awardReviewQualityBadges,
  getReviewBadgesEarnedSince,
} from '#root/services/challenge-completed-badges.js';

import { SubmissionStatus, VoteType } from '#root/models/enum/enums.js';

/* ------------------------------------------------------------------ */
beforeAll(async () => {
  await modelsInit.init();
  await Badge.seed();
});

/* Remove only our test data (rb_*) after all tests so test challenges don't show in the app. */
afterAll(async () => {
  const rbChallenges = await Challenge.findAll({
    where: { title: { [Op.like]: 'Review Challenge rb_%' } },
    attributes: ['id'],
  });
  const rbChallengeIds = rbChallenges.map((c) => c.id);
  if (rbChallengeIds.length === 0) return;

  const cmsRows = await ChallengeMatchSetting.findAll({
    where: { challengeId: { [Op.in]: rbChallengeIds } },
    attributes: ['id'],
  });
  const cmsIds = cmsRows.map((r) => r.id);
  const matches = await Match.findAll({
    where: { challengeMatchSettingId: { [Op.in]: cmsIds } },
    attributes: ['id'],
  });
  const matchIds = matches.map((m) => m.id);
  const submissions = await Submission.findAll({
    where: { matchId: { [Op.in]: matchIds } },
    attributes: ['id'],
  });
  const submissionIds = submissions.map((s) => s.id);
  const assignments = await PeerReviewAssignment.findAll({
    where: { submissionId: { [Op.in]: submissionIds } },
    attributes: ['id'],
  });
  const assignmentIds = assignments.map((a) => a.id);

  if (assignmentIds.length > 0) {
    await PeerReviewVote.destroy({
      where: { peerReviewAssignmentId: { [Op.in]: assignmentIds } },
    });
    await PeerReviewAssignment.destroy({
      where: { id: { [Op.in]: assignmentIds } },
    });
  }

  const rbUsers = await User.findAll({
    where: { username: { [Op.like]: 'rb_%' } },
    attributes: ['id'],
  });
  const rbUserIds = rbUsers.map((u) => u.id);
  if (rbUserIds.length > 0) {
    await StudentBadge.destroy({
      where: { studentId: { [Op.in]: rbUserIds } },
    });
  }
  await Submission.destroy({ where: { id: { [Op.in]: submissionIds } } });
  await Match.destroy({ where: { id: { [Op.in]: matchIds } } });
  await ChallengeParticipant.destroy({
    where: { challengeId: { [Op.in]: rbChallengeIds } },
  });
  await ChallengeMatchSetting.destroy({ where: { id: { [Op.in]: cmsIds } } });
  await Challenge.destroy({ where: { id: { [Op.in]: rbChallengeIds } } });

  const rbMatchSettings = await MatchSetting.findAll({
    where: { problemTitle: { [Op.like]: 'Review Problem rb_%' } },
    attributes: ['id'],
  });
  const rbMatchSettingIds = rbMatchSettings.map((r) => r.id);
  if (rbMatchSettingIds.length > 0) {
    await MatchSetting.destroy({
      where: { id: { [Op.in]: rbMatchSettingIds } },
    });
  }
  if (rbUserIds.length > 0) {
    await User.destroy({ where: { id: { [Op.in]: rbUserIds } } });
  }
});

function uniqueSuffix() {
  return `rb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ------------------------------------------------------------------ */
/* Helper: create N peer review votes for a reviewer student (counts toward
   countReviewsCompleted). Uses unique suffix so no conflicts with other tests. */
async function createReviewVotesForStudent(
  reviewerStudent,
  count,
  options = {}
) {
  const { vote = VoteType.CORRECT, isVoteCorrect = true } = options;
  const now = new Date();
  const suffix = uniqueSuffix();

  const matchSetting = await MatchSetting.create({
    problemTitle: `Review Problem ${suffix}`,
    problemDescription: 'desc',
    referenceSolution: 'solution',
    publicTests: [],
    privateTests: [],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Review Challenge ${suffix}`,
    duration: 30,
    startDatetime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    endDatetime: new Date(now.getTime() - 60 * 60 * 1000),
    durationPeerReview: 30,
    status: 'ended_phase_one',
  });

  const cms = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const reviewerParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: reviewerStudent.id,
  });

  const assignments = [];
  for (let i = 0; i < count; i++) {
    const author = await User.create({
      username: `rb_author_${suffix}_${i}`,
      email: `rb_author_${suffix}_${i}@test.com`,
      password: 'pw',
      role: 'student',
    });
    const authorParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: author.id,
    });
    const match = await Match.create({
      challengeMatchSettingId: cms.id,
      challengeParticipantId: authorParticipant.id,
    });
    const submission = await Submission.create({
      matchId: match.id,
      challengeParticipantId: authorParticipant.id,
      code: 'code',
      status: SubmissionStatus.PROBABLY_CORRECT,
      isFinal: true,
    });
    const assignment = await PeerReviewAssignment.create({
      submissionId: submission.id,
      reviewerId: reviewerParticipant.id,
      isExtra: false,
    });
    const votePayload = {
      peerReviewAssignmentId: assignment.id,
      vote,
    };
    if (vote === VoteType.INCORRECT) {
      votePayload.testCaseInput = '[1,2]';
      votePayload.expectedOutput = '["out"]';
    }
    votePayload.isVoteCorrect = isVoteCorrect;
    await PeerReviewVote.create(votePayload);
    assignments.push(assignment);
  }
  return { assignments, reviewerParticipant };
}

/* ------------------------------------------------------------------ */
describe('Review milestone badges (backend)', () => {
  it('unlocks review_3 (Getting Involved) when student has 3 reviews', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_reviewer3_${s}`,
      email: `rb_reviewer3_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    await createReviewVotesForStudent(student, 3);

    const result = await awardReviewMilestoneBadges(student.id);

    expect(result.completedReviews).toBe(3);
    const keys = result.newlyUnlocked.map((b) => b.key);
    expect(keys).toContain('review_3');
    expect(keys).not.toContain('review_5');
  });

  it('unlocks multiple milestone badges when threshold is reached', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_reviewer5_${s}`,
      email: `rb_reviewer5_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    await createReviewVotesForStudent(student, 5);

    const result = await awardReviewMilestoneBadges(student.id);

    expect(result.completedReviews).toBe(5);
    const keys = result.newlyUnlocked.map((b) => b.key);
    expect(keys).toEqual(expect.arrayContaining(['review_3', 'review_5']));
  });

  it('returns only newly unlocked badges and no duplicates on second call', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_nodup_${s}`,
      email: `rb_nodup_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    await createReviewVotesForStudent(student, 3);

    const first = await awardReviewMilestoneBadges(student.id);
    expect(first.newlyUnlocked.length).toBeGreaterThan(0);

    const second = await awardReviewMilestoneBadges(student.id);
    expect(second.newlyUnlocked).toHaveLength(0);
    expect(second.completedReviews).toBe(3);
  });
});

/* ------------------------------------------------------------------ */
describe('Review quality badges (backend)', () => {
  it('unlocks Reviewer Rookie when 5+ correct reviews with 80% accuracy', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_rookie_${s}`,
      email: `rb_rookie_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    await createReviewVotesForStudent(student, 5, {
      vote: VoteType.CORRECT,
      isVoteCorrect: true,
    });

    const result = await awardReviewQualityBadges(student.id);

    const keys = result.newlyUnlocked.map((b) => b.key);
    expect(keys).toContain('reviewer_rookie');
    expect(result.totalEvaluated).toBe(5);
    expect(result.correctReviews).toBe(5);
    expect(result.accuracy).toBe(1);
  });

  it('unlocks Code Detective when 10+ incorrect votes are correct', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_detective_${s}`,
      email: `rb_detective_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    await createReviewVotesForStudent(student, 10, {
      vote: VoteType.INCORRECT,
      isVoteCorrect: true,
    });

    const result = await awardReviewQualityBadges(student.id);

    const keys = result.newlyUnlocked.map((b) => b.key);
    expect(keys).toContain('code_detective');
    expect(result.errorsFound).toBe(10);
  });

  it('returns only newly unlocked quality badges on first call', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_quality_once_${s}`,
      email: `rb_quality_once_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    await createReviewVotesForStudent(student, 5, {
      vote: VoteType.CORRECT,
      isVoteCorrect: true,
    });

    const first = await awardReviewQualityBadges(student.id);
    expect(first.newlyUnlocked.some((b) => b.key === 'reviewer_rookie')).toBe(
      true
    );

    const second = await awardReviewQualityBadges(student.id);
    expect(second.newlyUnlocked).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
describe('getReviewBadgesEarnedSince (backend)', () => {
  it('returns review badges already earned by the student', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_earned_${s}`,
      email: `rb_earned_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    const reviewBadges = await Badge.findAll({
      where: { category: 'review_milestone' },
      order: [['threshold', 'ASC']],
      limit: 2,
    });
    const earnedAt = new Date();
    for (const badge of reviewBadges) {
      await StudentBadge.create({
        studentId: student.id,
        badgeId: badge.id,
        earnedAt,
      });
    }

    const result = await getReviewBadgesEarnedSince(student.id, null);

    expect(result).toHaveLength(2);
    const keys = result.map((b) => b.key);
    expect(keys).toEqual(
      expect.arrayContaining(reviewBadges.map((b) => b.key))
    );
    result.forEach((b) => {
      expect(b).toMatchObject({
        id: expect.any(Number),
        key: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        category: expect.stringMatching(/review_milestone|review_quality/),
      });
    });
  });

  it('filters by sinceDate when provided', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_since_date_${s}`,
      email: `rb_since_date_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    const badge = await Badge.findOne({
      where: { category: 'review_milestone' },
    });
    const oldDate = new Date('2020-01-01');
    await StudentBadge.create({
      studentId: student.id,
      badgeId: badge.id,
      earnedAt: oldDate,
    });

    const sinceRecent = new Date('2024-01-01');
    const result = await getReviewBadgesEarnedSince(student.id, sinceRecent);

    expect(result).toHaveLength(0);
  });

  it('includes badges earned on or after sinceDate', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_since_include_${s}`,
      email: `rb_since_include_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    const badge = await Badge.findOne({
      where: { category: 'review_milestone' },
    });
    const earnedAt = new Date('2024-06-15T12:00:00Z');
    await StudentBadge.create({
      studentId: student.id,
      badgeId: badge.id,
      earnedAt,
    });

    const sinceDate = new Date('2024-06-01');
    const result = await getReviewBadgesEarnedSince(student.id, sinceDate);

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe(badge.key);
  });

  it('returns only review category badges (not challenge milestone)', async () => {
    const s = uniqueSuffix();
    const student = await User.create({
      username: `rb_only_review_${s}`,
      email: `rb_only_review_${s}@test.com`,
      password: 'pw',
      role: 'student',
    });
    const challengeBadge = await Badge.findOne({
      where: { category: 'challenge_milestone' },
    });
    const reviewBadge = await Badge.findOne({
      where: { category: 'review_milestone' },
    });
    const now = new Date();
    await StudentBadge.create({
      studentId: student.id,
      badgeId: challengeBadge.id,
      earnedAt: now,
    });
    await StudentBadge.create({
      studentId: student.id,
      badgeId: reviewBadge.id,
      earnedAt: now,
    });

    const result = await getReviewBadgesEarnedSince(student.id, null);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(reviewBadge.id);
    expect(result[0].category).toBe('review_milestone');
  });
});
