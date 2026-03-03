import Badge from '#root/models/badge.js';
import Title from '#root/models/title.js';

export default async function getRules() {
  const [badges, titles] = await Promise.all([
    Badge.findAll({
      attributes: [
        'key',
        'name',
        'description',
        'category',
        'level',
        'iconKey',
        'threshold',
        'metric',
        'accuracyRequired',
      ],
      order: [
        ['category', 'ASC'],
        ['level', 'ASC'],
        ['threshold', 'ASC'],
        ['name', 'ASC'],
      ],
      raw: true,
    }),

    Title.findAll({
      attributes: [
        'key',
        'name',
        'description',
        'rank',
        'minChallenges',
        'minAvgScore',
        'minBadges',
      ],
      order: [['rank', 'ASC']],
      raw: true,
    }),
  ]);

  const badgesByCategory = {
    challenge_milestone: [],
    review_milestone: [],
    review_quality: [],
  };

  for (const b of badges) {
    (badgesByCategory[b.category] ??= []).push(b);
  }

  return { badgesByCategory, titles };
}
