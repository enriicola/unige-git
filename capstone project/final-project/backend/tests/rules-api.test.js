import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '#root/app_initial.js';
import Badge from '#root/models/badge.js';
import Title from '#root/models/title.js';

describe('Skill Rules API', () => {
  beforeEach(async () => {
    // Ensure badges and titles are seeded
    await Badge.seed();
    await Title.seed();
  });

  it('GET /api/rest/rules returns badges grouped by category and titles', async () => {
    const res = await request(app).get('/api/rest/rules');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { data } = res.body;
    expect(data).toHaveProperty('badgesByCategory');
    expect(data).toHaveProperty('titles');

    const { badgesByCategory, titles } = data;

    // Check Badges
    // We expect the categories defined in rules.js to be present
    expect(badgesByCategory).toHaveProperty('challenge_milestone');
    expect(badgesByCategory).toHaveProperty('review_milestone');
    expect(badgesByCategory).toHaveProperty('review_quality');

    // Validate challenge_milestone
    const challenges = badgesByCategory.challenge_milestone;
    expect(Array.isArray(challenges)).toBe(true);
    expect(challenges.length).toBeGreaterThan(0);
    expect(challenges[0]).toHaveProperty('category', 'challenge_milestone');
    expect(challenges[0]).toHaveProperty('metric', 'challenges_completed');
    expect(challenges[0]).toHaveProperty('iconKey');
    expect(challenges[0]).toHaveProperty('threshold');

    // Validate review_quality specifically for accuracy field
    const quality = badgesByCategory.review_quality;
    expect(Array.isArray(quality)).toBe(true);
    expect(quality.length).toBeGreaterThan(0);
    const rookieBadge = quality.find((b) => b.key === 'reviewer_rookie');
    if (rookieBadge) {
      expect(rookieBadge).toHaveProperty('accuracyRequired', 0.8);
    }

    // Verify Badge Sorting (Threshold ASC)
    for (let i = 0; i < challenges.length - 1; i++) {
      const current = challenges[i];
      const next = challenges[i + 1];
      // Badges should be sorted by threshold. If thresholds are equal, then by name (as per rules.js)
      if (current.threshold !== next.threshold) {
        expect(current.threshold).toBeLessThanOrEqual(next.threshold);
      }
    }

    // Validate review_milestone
    const reviews = badgesByCategory.review_milestone;
    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0]).toHaveProperty('category', 'review_milestone');
    expect(reviews[0]).toHaveProperty('metric', 'reviews_completed');

    // Check Titles
    expect(Array.isArray(titles)).toBe(true);
    expect(titles.length).toBe(5); // We seed 5 titles: newbie, pupil, specialist, expert, master

    const firstTitle = titles[0];
    expect(firstTitle).toHaveProperty('key', 'newbie');
    expect(firstTitle).toHaveProperty('rank', 1);

    const lastTitle = titles[4];
    expect(lastTitle).toHaveProperty('key', 'master');
    expect(lastTitle).toHaveProperty('rank', 5);

    // Verify Title Sorting (Rank ASC)
    for (let i = 0; i < titles.length - 1; i++) {
      expect(titles[i].rank).toBeLessThan(titles[i + 1].rank);
    }
  });

  it('Badge.seed and Title.seed are idempotent', async () => {
    // Run seed again
    await Badge.seed();
    await Title.seed();

    const badgeCount = await Badge.count();
    const titleCount = await Title.count();

    // We expect the count to remain the same as defined in the models
    // Badge has 12 items, Title has 5 items
    expect(badgeCount).toBe(12);
    expect(titleCount).toBe(5);
  });

  describe('Empty Database State', () => {
    beforeEach(async () => {
      // Clear database with cascade to handle foreign keys
      await Badge.destroy({ where: {}, cascade: true, force: true });
      await Title.destroy({ where: {}, cascade: true, force: true });
    });

    it('returns empty structures when no data exists', async () => {
      const res = await request(app).get('/api/rest/rules');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const { data } = res.body;

      expect(data.titles).toEqual([]);
      expect(data.badgesByCategory).toHaveProperty('challenge_milestone', []);
      expect(data.badgesByCategory).toHaveProperty('review_milestone', []);
      expect(data.badgesByCategory).toHaveProperty('review_quality', []);
    });
  });
});
