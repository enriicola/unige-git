import sequelize from '#root/services/sequelize.js';
import Challenge from '#root/models/challenge.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import { ChallengeStatus, SubmissionStatus } from '#root/models/enum/enums.js';
import { Op } from 'sequelize';
import {
  getInFlightSubmissionsCount,
  maybeCompletePhaseOneFinalization,
} from '#root/services/phase-one-finalization.js';

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const buildTargetCounts = (submissions, baseReviews, extraReviews) => {
  const counts = new Map();
  submissions.forEach((submission) => {
    counts.set(submission.id, baseReviews);
  });
  if (extraReviews > 0 && submissions.length > 0) {
    const order = shuffle([...submissions]);
    for (let i = 0; i < extraReviews; i += 1) {
      const submission = order[i % order.length];
      counts.set(submission.id, counts.get(submission.id) + 1);
    }
  }
  return counts;
};

const markExtraAssignments = (assignments, baseReviewsPerSubmission) => {
  const grouped = new Map();
  assignments.forEach((assignment) => {
    if (!grouped.has(assignment.submissionId)) {
      grouped.set(assignment.submissionId, []);
    }
    grouped.get(assignment.submissionId).push(assignment);
  });

  const results = [];
  grouped.forEach((group) => {
    const extraCount = Math.max(0, group.length - baseReviewsPerSubmission);
    const shuffled = shuffle([...group]);
    shuffled.forEach((assignment, index) => {
      results.push({
        ...assignment,
        isExtra: index < extraCount,
      });
    });
  });

  return results;
};

const buildAssignmentsWithMaxFlow = ({
  reviewers,
  submissions,
  targetCounts,
  reviewsPerReviewer,
}) => {
  const reviewerIds = shuffle([...reviewers]);
  const submissionList = shuffle([...submissions]);
  const submissionIndexById = new Map(
    submissionList.map((submission, index) => [submission.id, index])
  );

  const source = 0;
  const reviewerOffset = 1;
  const submissionOffset = reviewerOffset + reviewerIds.length;
  const sink = submissionOffset + submissionList.length;
  const nodeCount = sink + 1;

  const graph = Array.from({ length: nodeCount }, () => []);

  const addEdge = (from, to, cap) => {
    const forward = { to, rev: graph[to].length, cap };
    const backward = { to: from, rev: graph[from].length, cap: 0 };
    graph[from].push(forward);
    graph[to].push(backward);
  };

  reviewerIds.forEach((reviewerId, index) => {
    const reviewerNode = reviewerOffset + index;
    addEdge(source, reviewerNode, reviewsPerReviewer);
    const eligibleSubmissions = shuffle([...submissionList]);
    eligibleSubmissions.forEach((submission) => {
      if (submission.authorId === reviewerId) return;
      const submissionIndex = submissionIndexById.get(submission.id);
      const submissionNode = submissionOffset + submissionIndex;
      addEdge(reviewerNode, submissionNode, 1);
    });
  });

  submissionList.forEach((submission, index) => {
    const submissionNode = submissionOffset + index;
    const target = targetCounts.get(submission.id) || 0;
    if (target > 0) addEdge(submissionNode, sink, target);
  });

  const level = new Array(nodeCount).fill(-1);
  const queue = [];
  const bfs = () => {
    level.fill(-1);
    queue.length = 0;
    level[source] = 0;
    queue.push(source);
    while (queue.length > 0) {
      const v = queue.shift();
      graph[v].forEach((edge) => {
        if (edge.cap > 0 && level[edge.to] < 0) {
          level[edge.to] = level[v] + 1;
          queue.push(edge.to);
        }
      });
    }
    return level[sink] >= 0;
  };

  const iter = new Array(nodeCount).fill(0);
  const dfs = (v, flow) => {
    if (v === sink) return flow;
    for (let i = iter[v]; i < graph[v].length; i += 1) {
      iter[v] = i;
      const edge = graph[v][i];
      if (edge.cap > 0 && level[v] < level[edge.to]) {
        const d = dfs(edge.to, Math.min(flow, edge.cap));
        if (d > 0) {
          edge.cap -= d;
          graph[edge.to][edge.rev].cap += d;
          return d;
        }
      }
    }
    return 0;
  };

  let flow = 0;
  const totalNeeded = reviewerIds.length * reviewsPerReviewer;
  const INF = Number.MAX_SAFE_INTEGER;
  while (bfs()) {
    iter.fill(0);
    let f;
    while ((f = dfs(source, INF)) > 0) {
      flow += f;
    }
  }

  if (flow !== totalNeeded) return null;

  const assignments = [];
  reviewerIds.forEach((reviewerId, index) => {
    const reviewerNode = reviewerOffset + index;
    graph[reviewerNode].forEach((edge) => {
      if (
        edge.to >= submissionOffset &&
        edge.to < submissionOffset + submissionList.length
      ) {
        const reverseEdge = graph[edge.to][edge.rev];
        if (reverseEdge.cap > 0) {
          const submissionIndex = edge.to - submissionOffset;
          const submission = submissionList[submissionIndex];
          assignments.push({
            submissionId: submission.id,
            reviewerId,
            isExtra: false,
          });
        }
      }
    });
  });

  return assignments;
};

const generateAssignments = ({ reviewers, submissions, expectedReviews }) => {
  if (reviewers.length === 0) return { error: 'no_reviewers' };
  const validSubmissions = submissions.length;
  const totalDesired = validSubmissions * expectedReviews;
  const reviewsPerReviewer = Math.min(
    Math.ceil(totalDesired / reviewers.length),
    validSubmissions - 1
  );

  if (reviewsPerReviewer <= 0)
    return { error: 'insufficient_valid_submissions' };

  const totalAssigned = reviewsPerReviewer * reviewers.length;
  const baseReviewsPerSubmission =
    totalAssigned >= totalDesired
      ? expectedReviews
      : Math.floor(totalAssigned / validSubmissions);
  const extraReviews =
    totalAssigned - baseReviewsPerSubmission * validSubmissions;

  const targetCounts = buildTargetCounts(
    submissions,
    baseReviewsPerSubmission,
    extraReviews
  );
  const assignments = buildAssignmentsWithMaxFlow({
    reviewers,
    submissions,
    targetCounts,
    reviewsPerReviewer,
  });

  if (!assignments) return { error: 'assignment_failed' };

  return {
    assignments: markExtraAssignments(assignments, baseReviewsPerSubmission),
    reviewsPerReviewer,
    baseReviewsPerSubmission,
    extraReviews,
    totalAssigned,
  };
};

export default async function assignPeerReviews({
  challengeId,
  expectedReviewsPerSubmission,
}) {
  const expectedReviews = Number(expectedReviewsPerSubmission);
  if (!Number.isInteger(expectedReviews) || expectedReviews < 2) {
    return { status: 'invalid_expected_reviews' };
  }

  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) return { status: 'challenge_not_found' };

  if (challenge.status !== ChallengeStatus.ENDED_PHASE_ONE) {
    return {
      status: 'invalid_status',
      challengeStatus: challenge.status,
    };
  }

  const inFlightSubmissionsCount = getInFlightSubmissionsCount(challengeId);
  if (inFlightSubmissionsCount > 0) {
    return {
      status: 'finalization_pending',
      inFlightSubmissionsCount,
    };
  }

  if (!challenge.phaseOneFinalizationCompletedAt) {
    await maybeCompletePhaseOneFinalization({ challengeId });
    await challenge.reload();
  }

  if (!challenge.phaseOneFinalizationCompletedAt) {
    return {
      status: 'finalization_pending',
      inFlightSubmissionsCount: 0,
    };
  }

  const matches = await Match.findAll({
    attributes: ['id', 'challengeMatchSettingId', 'challengeParticipantId'],
    include: [
      {
        model: ChallengeMatchSetting,
        as: 'challengeMatchSetting',
        attributes: ['id'],
        where: { challengeId },
      },
    ],
    order: [['id', 'ASC']],
  });

  if (!matches.length) return { status: 'no_matches' };

  if (challenge.allowedNumberOfReview !== expectedReviews) {
    await challenge.update({ allowedNumberOfReview: expectedReviews });
  }

  const matchIds = matches.map((matchRow) => matchRow.id);
  const matchSettingByMatchId = new Map(
    matches.map((matchRow) => [matchRow.id, matchRow.challengeMatchSettingId])
  );

  const groups = new Map();
  matches.forEach((matchRow) => {
    const cmsId = matchRow.challengeMatchSettingId;
    if (!groups.has(cmsId)) {
      groups.set(cmsId, {
        challengeMatchSettingId: cmsId,
        matchIds: [],
        reviewerIds: new Set(),
        submissions: [],
      });
    }
    const group = groups.get(cmsId);
    group.matchIds.push(matchRow.id);
    group.reviewerIds.add(matchRow.challengeParticipantId);
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

  validSubmissions.forEach((submission) => {
    const cmsId = matchSettingByMatchId.get(submission.matchId);
    if (!cmsId || !groups.has(cmsId)) return;
    groups.get(cmsId).submissions.push({
      id: submission.id,
      authorId: submission.challengeParticipantId,
    });
  });

  const results = [];
  for (const group of groups.values()) {
    const reviewers = Array.from(group.reviewerIds);
    const submissions = group.submissions;
    const validCount = submissions.length;

    if (validCount <= 1) {
      results.push({
        challengeMatchSettingId: group.challengeMatchSettingId,
        status: 'insufficient_valid_submissions',
        validSubmissionsCount: validCount,
        reviewerCount: reviewers.length,
        teacherMessage:
          'Peer review cannot be assigned because there are not enough valid submissions.',
        studentMessage:
          'Peer review is not available for this match because there are not enough valid submissions.',
      });
      continue;
    }

    const assignmentResult = generateAssignments({
      reviewers,
      submissions,
      expectedReviews,
    });

    if (assignmentResult.error) {
      results.push({
        challengeMatchSettingId: group.challengeMatchSettingId,
        status: assignmentResult.error,
        validSubmissionsCount: validCount,
        reviewerCount: reviewers.length,
        teacherMessage:
          'Peer review assignments could not be generated for this match.',
      });
      continue;
    }

    const submissionIds = assignmentResult.assignments.map(
      (assignment) => assignment.submissionId
    );

    try {
      await sequelize.transaction(async (transaction) => {
        if (submissionIds.length > 0) {
          await PeerReviewAssignment.destroy({
            where: { submissionId: { [Op.in]: submissionIds } },
            transaction,
          });
        }
        await PeerReviewAssignment.bulkCreate(assignmentResult.assignments, {
          transaction,
        });
      });

      const reducedExpectation =
        assignmentResult.baseReviewsPerSubmission < expectedReviews;

      results.push({
        challengeMatchSettingId: group.challengeMatchSettingId,
        status: 'assigned',
        validSubmissionsCount: validCount,
        reviewerCount: reviewers.length,
        reviewsPerStudent: assignmentResult.reviewsPerReviewer,
        baseReviewsPerSubmission: assignmentResult.baseReviewsPerSubmission,
        extraReviewsCount: assignmentResult.extraReviews,
        totalAssignments: assignmentResult.totalAssigned,
        teacherMessage: reducedExpectation
          ? `Expected reviews per submission reduced to ${assignmentResult.baseReviewsPerSubmission} due to insufficient valid submissions.`
          : null,
        studentMessage: reducedExpectation
          ? `Expected reviews per submission reduced to ${assignmentResult.baseReviewsPerSubmission} due to insufficient valid submissions.`
          : null,
      });
    } catch (error) {
      results.push({
        challengeMatchSettingId: group.challengeMatchSettingId,
        status: 'assignment_failed',
        validSubmissionsCount: validCount,
        reviewerCount: reviewers.length,
        teacherMessage:
          'Peer review assignments could not be saved for this match.',
      });
    }
  }

  return {
    status: 'ok',
    expectedReviewsPerSubmission: expectedReviews,
    results,
  };
}
