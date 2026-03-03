import Title from '#root/models/title.js';

export async function evaluateTitleEligibility({ profileData }) {
  if (!profileData?.stats) return { eligible: false, newTitle: null };
  const titles = await Title.findAll({
    order: [['rank', 'ASC']],
    raw: true,
  });
  if (!titles.length) return { eligible: false, newTitle: null };
  // Current rank from profile data.
  const currentRank = profileData.title
    ? (titles.find((t) => t.name === profileData.title.name)?.rank ?? 1)
    : 1;
  const higherTitles = titles.filter((title) => title.rank > currentRank);
  if (higherTitles.length === 0) return { eligible: false, newTitle: null };
  const { totalChallenges, avgTotalScore, badgesEarned } = profileData.stats;
  const eligibleTitles = higherTitles.filter(
    (title) =>
      totalChallenges >= title.minChallenges &&
      avgTotalScore >= title.minAvgScore &&
      badgesEarned >= title.minBadges
  );
  if (eligibleTitles.length === 0) return { eligible: false, newTitle: null };
  const newTitle = eligibleTitles[eligibleTitles.length - 1];

  return {
    eligible: true,
    newTitle: {
      id: newTitle.id,
      name: newTitle.name,
      description: newTitle.description,
      rank: newTitle.rank,
      minChallenges: newTitle.minChallenges,
      minAvgScore: newTitle.minAvgScore,
      minBadges: newTitle.minBadges,
    },
  };
}
