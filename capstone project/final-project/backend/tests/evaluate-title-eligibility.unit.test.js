import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Title from '#root/models/title.js';
import { evaluateTitleEligibility } from '#root/services/evaluateTitleEligibility.js';

const titleFixtures = [
  {
    id: 1,
    key: 'newbie',
    name: 'Newbie',
    description: 'Just getting started',
    rank: 1,
    minChallenges: 0,
    minAvgScore: 0,
    minBadges: 0,
  },
  {
    id: 2,
    key: 'pupil',
    name: 'Pupil',
    description: 'Developing fundamentals',
    rank: 2,
    minChallenges: 3,
    minAvgScore: 50,
    minBadges: 0,
  },
  {
    id: 3,
    key: 'specialist',
    name: 'Specialist',
    description: 'Building solid expertise',
    rank: 3,
    minChallenges: 15,
    minAvgScore: 70,
    minBadges: 3,
  },
  {
    id: 4,
    key: 'expert',
    name: 'Expert',
    description: 'Skilled coder with proven excellence',
    rank: 4,
    minChallenges: 30,
    minAvgScore: 80,
    minBadges: 10,
  },
  {
    id: 5,
    key: 'master',
    name: 'Master',
    description: 'Top-tier problem solver with exceptional achievement',
    rank: 5,
    minChallenges: 50,
    minAvgScore: 85,
    minBadges: 20,
  },
];

describe('evaluateTitleEligibility (unit)', () => {
  beforeEach(() => {
    vi.spyOn(Title, 'findAll').mockResolvedValue(titleFixtures);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('awards the highest eligible title when multiple levels are crossed at once', async () => {
    const result = await evaluateTitleEligibility({
      profileData: {
        title: { name: 'Newbie' },
        stats: {
          totalChallenges: 20,
          avgTotalScore: 81,
          badgesEarned: 4,
        },
      },
    });

    expect(result.eligible).toBe(true);
    expect(result.newTitle).toMatchObject({
      name: 'Specialist',
      rank: 3,
      minChallenges: 15,
      minAvgScore: 70,
      minBadges: 3,
    });
  });

  it('does not award a title when all requirements for higher ranks are not met', async () => {
    const result = await evaluateTitleEligibility({
      profileData: {
        title: { name: 'Pupil' },
        stats: {
          totalChallenges: 20,
          avgTotalScore: 79,
          badgesEarned: 2,
        },
      },
    });

    expect(result).toEqual({
      eligible: false,
      newTitle: null,
    });
  });

  it('does not award a title when stats are missing', async () => {
    const result = await evaluateTitleEligibility({
      profileData: {
        title: { name: 'Newbie' },
      },
    });

    expect(result).toEqual({
      eligible: false,
      newTitle: null,
    });
  });

  it('does not award a new title when the student is already at the highest rank', async () => {
    const result = await evaluateTitleEligibility({
      profileData: {
        title: { name: 'Master' },
        stats: {
          totalChallenges: 999,
          avgTotalScore: 99,
          badgesEarned: 999,
        },
      },
    });

    expect(result).toEqual({
      eligible: false,
      newTitle: null,
    });
  });
});
