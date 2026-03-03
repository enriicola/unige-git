import sequelize from '#root/services/sequelize.js';
import User from '#root/models/user.js';
import Title from '#root/models/title.js';
import StudentBadge from '#root/models/student-badges.js';
import Badge from '#root/models/badge.js';

import ChallengeParticipant from '#root/models/challenge-participant.js';
import SubmissionScoreBreakdown from '#root/models/submission-score-breakdown.js';

import Challenge from '#root/models/challenge.js';

import PeerReviewVote from '#root/models/peer-review-vote.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
export default async function studentProfile({ studentId }) {
  const user = await User.findByPk(studentId, {
    attributes: ['id', 'username', 'email', 'titleId'],
    raw: true,
  });

  if (!user) return { status: 'user_not_found' };

  const currentTitle = user.titleId
    ? await Title.findByPk(user.titleId, {
        attributes: ['name', 'description', 'rank'],
        raw: true,
      })
    : await Title.findOne({
        where: { rank: 1 },
        attributes: ['name', 'description', 'rank'],
        raw: true,
      });

  const nextTitle = currentTitle
    ? await Title.findOne({
        where: { rank: currentTitle.rank + 1 },
        attributes: ['name', 'description', 'rank'],
        raw: true,
      })
    : null;

  const studentBadges = await StudentBadge.findAll({
    where: { studentId },
    attributes: ['earnedAt'],
    include: [
      {
        model: Badge,
        as: 'badge',
        attributes: ['key', 'name', 'category', 'iconKey'],
      },
    ],
    order: [['earnedAt', 'DESC']],
  });

  const badgesEarned = studentBadges.length;
  const badges = {
    milestone: [],
    codeReview: [],
    reviewQuality: [],
  };

  for (const sb of studentBadges) {
    const b = sb.badge;
    const shaped = {
      key: b.key,
      name: b.name,
      category: b.category,
      iconKey: b.iconKey,
      earnedAt: sb.earnedAt,
    };

    if (b.category === 'challenge_milestone') badges.milestone.push(shaped);
    else if (b.category === 'review_milestone') badges.codeReview.push(shaped);
    else badges.reviewQuality.push(shaped);
  }
  const scoreAgg = await SubmissionScoreBreakdown.findOne({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('total_score')), 'avgTotalScore'],
      [
        sequelize.fn('AVG', sequelize.col('implementation_score')),
        'avgImplementation',
      ],
      [
        sequelize.fn('AVG', sequelize.col('code_review_score')),
        'avgCodeReview',
      ],
    ],
    include: [
      {
        model: ChallengeParticipant,
        as: 'challengeParticipant',
        required: true,
        attributes: [],
        where: { studentId },
      },
    ],
    raw: true,
  });

  const avgTotalScore = Number(scoreAgg?.avgTotalScore ?? 0);
  const avgImplementation = Number(scoreAgg?.avgImplementation ?? 0);
  const avgCodeReview = Number(scoreAgg?.avgCodeReview ?? 0);

  const reviewAgg = await PeerReviewVote.findOne({
    attributes: [
      [
        sequelize.fn(
          'COUNT',
          sequelize.literal(
            `CASE WHEN "PeerReviewVote"."is_vote_correct" IS NOT NULL THEN 1 END`
          )
        ),
        'totalReviews',
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

  const totalReviews = Number(reviewAgg?.totalReviews ?? 0);
  const correctReviews = Number(reviewAgg?.correctReviews ?? 0);

  const reviewAccuracy =
    totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

  const challengesCompleted = await SubmissionScoreBreakdown.count({
    include: [
      {
        model: ChallengeParticipant,
        as: 'challengeParticipant',
        required: true,
        attributes: [],
        where: { studentId },
      },
    ],
  });

  const historyRows = await ChallengeParticipant.findAll({
    where: { studentId },
    attributes: [],
    include: [
      {
        model: Challenge,
        required: true,
        attributes: ['id', 'title'],
      },
      {
        model: SubmissionScoreBreakdown,
        as: 'scoreBreakdown',
        required: true,
        attributes: ['createdAt'],
      },
    ],
    order: [
      [
        { model: SubmissionScoreBreakdown, as: 'scoreBreakdown' },
        'createdAt',
        'DESC',
      ],
    ],
    raw: false,
  });
  const challengeHistory = historyRows.map((row) => ({
    id: row.Challenge.id,
    title: row.Challenge.title,
    createdAt: row.scoreBreakdown.createdAt,
  }));

  return {
    status: 'ok',
    data: {
      user: { id: user.id, username: user.username, email: user.email },
      title: {
        name: currentTitle?.name ?? null,
        description: currentTitle?.description ?? null,
        nextTitle: nextTitle?.name ?? null,
      },
      badges,
      stats: {
        totalChallenges: challengesCompleted,
        avgTotalScore,
        avgImplementation,
        avgCodeReview,
        reviewsGiven: totalReviews,
        reviewAccuracy,
        badgesEarned,
      },
      challengeHistory,
    },
  };
}
