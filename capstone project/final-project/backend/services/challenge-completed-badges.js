import sequelize from '#root/services/sequelize.js';
import Badge from '#root/models/badge.js';
import StudentBadge from '#root/models/student-badges.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import logger from '#root/services/logger.js';
import { Op, QueryTypes } from 'sequelize';
import { BadgeCategory, BadgeMetric } from '#root/models/enum/enums.js';
import { VoteType } from '#root/models/enum/enums.js';

/**
 * Count the number of completed challenges for a student.
 *
 * A challenge is considered completed if:
 * - at least one final submission exists
 * - submission status is 'probably_correct' or 'improvable'
 * - score breakdown exists with totalScore > 25
 *
 * Each challenge is counted only once.
 */
export async function countCompletedChallenges(studentId) {
  const sql = `
    SELECT COUNT(DISTINCT C.id) AS "challengeCompleted"
    FROM CHALLENGE_PARTICIPANT C
    JOIN SUBMISSION S ON S.CHALLENGE_PARTICIPANT_ID = C.ID
    JOIN SUBMISSION_SCORE_BREAKDOWN B ON B.SUBMISSION_ID = S.ID
    WHERE S.STATUS IN ('probably_correct', 'improvable')
    AND S.IS_FINAL = TRUE
    AND B.TOTAL_SCORE > 25
    AND C.STUDENT_ID = :studentId
    GROUP BY C.STUDENT_ID
    LIMIT 100;
  `;

  try {
    const [results] = await sequelize.query(sql, {
      replacements: { studentId },
      type: QueryTypes.SELECT,
    });

    const completedCount = Number(results?.challengeCompleted ?? 0);

    logger.info(
      `Student ${studentId} completed challenges count: ${completedCount}`
    );

    return completedCount;
  } catch (error) {
    logger.error('Error counting completed challenges:', error);
    return 0;
  }
}

/**
 * Count the number of submissions reviewed by a student (any vote cast:
 * correct, incorrect, or abstain). Used for review milestone badges (3, 5, 10, …).
 */
export async function countReviewsCompleted(studentId) {
  const count = await PeerReviewVote.count({
    include: [
      {
        model: PeerReviewAssignment,
        as: 'assignment',
        required: true,
        attributes: [],
        include: [
          {
            model: ChallengeParticipant,
            as: 'reviewer',
            required: true,
            attributes: [],
            where: { studentId },
          },
        ],
      },
    ],
  });
  logger.info(
    `Student ${studentId} submissions reviewed (milestone) count: ${count}`
  );
  return count;
}

/**
 * Get review quality stats for a student (evaluated reviews only; abstain does not count).
 * Used for quality badges: Reviewer Rookie, Code Detective, Review Master.
 */
export async function getReviewQualityStats(studentId) {
  const row = await PeerReviewVote.findOne({
    attributes: [
      [
        sequelize.fn(
          'COUNT',
          sequelize.literal(
            `CASE WHEN "PeerReviewVote"."is_vote_correct" IS NOT NULL AND "PeerReviewVote"."vote" != '${VoteType.ABSTAIN}' THEN 1 END`
          )
        ),
        'totalEvaluated',
      ],
      [
        sequelize.fn(
          'SUM',
          sequelize.literal(
            `CASE WHEN "PeerReviewVote"."is_vote_correct" = true THEN 1 ELSE 0 END`
          )
        ),
        'correctReviews',
      ],
      [
        sequelize.fn(
          'SUM',
          sequelize.literal(
            `CASE WHEN "PeerReviewVote"."vote" = '${VoteType.INCORRECT}' AND "PeerReviewVote"."is_vote_correct" = true THEN 1 ELSE 0 END`
          )
        ),
        'errorsFound',
      ],
    ],
    include: [
      {
        model: PeerReviewAssignment,
        as: 'assignment',
        required: true,
        attributes: [],
        include: [
          {
            model: ChallengeParticipant,
            as: 'reviewer',
            required: true,
            attributes: [],
            where: { studentId },
          },
        ],
      },
    ],
    raw: true,
  });

  const totalEvaluated = Number(row?.totalEvaluated ?? 0);
  const correctReviews = Number(row?.correctReviews ?? 0);
  const errorsFound = Number(row?.errorsFound ?? 0);
  const accuracy = totalEvaluated > 0 ? correctReviews / totalEvaluated : 0;

  return {
    totalEvaluated,
    correctReviews,
    errorsFound,
    accuracy,
  };
}

/**
 * Award review milestone badges (3, 5, 10, 15, 20, 25 submissions reviewed).
 * Only newly unlocked badges are returned.
 */
export async function awardReviewMilestoneBadges(studentId) {
  const completedReviews = await countReviewsCompleted(studentId);

  const eligibleBadges = await Badge.findAll({
    where: {
      category: BadgeCategory.REVIEW_MILESTONE,
      metric: BadgeMetric.REVIEWS_COMPLETED,
      threshold: { [Op.lte]: completedReviews },
    },
    order: [['threshold', 'ASC']],
  });

  const newlyUnlocked = [];

  for (const badge of eligibleBadges) {
    const [, created] = await StudentBadge.findOrCreate({
      where: { studentId, badgeId: badge.id },
      defaults: { earnedAt: new Date() },
    });

    if (created) {
      newlyUnlocked.push({
        id: badge.id,
        key: badge.key,
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
        level: badge.level,
        threshold: badge.threshold,
        metric: badge.metric,
        accuracyRequired: badge.accuracyRequired,
        category: badge.category,
        createdAt: badge.createdAt,
        updatedAt: badge.updatedAt,
      });
      logger.info(
        `Review milestone badge ${badge.id} just unlocked for student ${studentId}`
      );
    }
  }

  return {
    newlyUnlocked,
    completedReviews,
  };
}

/**
 * Award review quality badges (Reviewer Rookie, Code Detective, Review Master).
 * Abstain votes do not count. Only newly unlocked badges are returned.
 */
export async function awardReviewQualityBadges(studentId) {
  const stats = await getReviewQualityStats(studentId);
  const { totalEvaluated, correctReviews, errorsFound, accuracy } = stats;

  const qualityBadges = await Badge.findAll({
    where: { category: BadgeCategory.REVIEW_QUALITY },
    order: [['threshold', 'ASC']],
  });

  const newlyUnlocked = [];

  for (const badge of qualityBadges) {
    let eligible = false;
    if (badge.metric === BadgeMetric.CORRECT_REVIEWS) {
      eligible =
        correctReviews >= badge.threshold &&
        (badge.accuracyRequired == null || accuracy >= badge.accuracyRequired);
    } else if (badge.metric === BadgeMetric.ERRORS_FOUND) {
      eligible = errorsFound >= badge.threshold;
    } else if (
      badge.metric === BadgeMetric.REVIEWS_COMPLETED &&
      badge.accuracyRequired != null
    ) {
      eligible =
        totalEvaluated >= badge.threshold && accuracy >= badge.accuracyRequired;
    }

    if (!eligible) continue;

    const [, created] = await StudentBadge.findOrCreate({
      where: { studentId, badgeId: badge.id },
      defaults: { earnedAt: new Date() },
    });

    if (created) {
      newlyUnlocked.push({
        id: badge.id,
        key: badge.key,
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
        level: badge.level,
        threshold: badge.threshold,
        metric: badge.metric,
        accuracyRequired: badge.accuracyRequired,
        category: badge.category,
        createdAt: badge.createdAt,
        updatedAt: badge.updatedAt,
      });
      logger.info(
        `Review quality badge ${badge.id} just unlocked for student ${studentId}`
      );
    }
  }

  return {
    newlyUnlocked,
    ...stats,
  };
}

/**
 * Award milestone badges if challenge completion thresholds are reached.
 * Only newly unlocked badges are returned.
 */
export async function awardChallengeMilestoneBadges(studentId) {
  const completedChallenges = await countCompletedChallenges(studentId);

  const eligibleBadges = await Badge.findAll({
    where: {
      category: BadgeCategory.CHALLENGE_MILESTONE,
      metric: BadgeMetric.CHALLENGES_COMPLETED,
      threshold: { [Op.lte]: completedChallenges },
    },
    order: [['threshold', 'ASC']],
  });

  const newlyUnlocked = [];

  for (const badge of eligibleBadges) {
    const [, created] = await StudentBadge.findOrCreate({
      where: { studentId, badgeId: badge.id },
      defaults: { earnedAt: new Date() },
    });

    if (created) {
      newlyUnlocked.push({
        id: badge.id,
        key: badge.key,
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
        level: badge.level,
        threshold: badge.threshold,
        metric: badge.metric,
        accuracyRequired: badge.accuracyRequired,
        category: badge.category,
        createdAt: badge.createdAt,
        updatedAt: badge.updatedAt,
      });

      logger.info(`Badge ${badge.id} just unlocked for student ${studentId}`);
    }
  }

  return {
    newlyUnlocked,
    completedChallenges,
  };
}

/**
 * Get review badges (milestone + quality) already earned by the student since a
 * given date. Used by GET results so the result page modal can show review
 * badges that were awarded during finalize (and thus not "newly created" when
 * the user hits the endpoint).
 */
export async function getReviewBadgesEarnedSince(studentId, sinceDate) {
  const where = { studentId };
  if (sinceDate) {
    where.earnedAt = { [Op.gte]: sinceDate };
  }
  const studentBadges = await StudentBadge.findAll({
    where,
    include: [
      {
        model: Badge,
        as: 'badge',
        required: true,
        where: {
          category: {
            [Op.in]: [
              BadgeCategory.REVIEW_MILESTONE,
              BadgeCategory.REVIEW_QUALITY,
            ],
          },
        },
      },
    ],
    order: [[{ model: Badge, as: 'badge' }, 'threshold', 'ASC']],
  });

  return studentBadges
    .filter((sb) => sb.badge)
    .map((sb) => {
      const badge = sb.badge;
      return {
        id: badge.id,
        key: badge.key,
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
        level: badge.level,
        threshold: badge.threshold,
        metric: badge.metric,
        accuracyRequired: badge.accuracyRequired,
        category: badge.category,
        createdAt: badge.createdAt,
        updatedAt: badge.updatedAt,
      };
    });
}
