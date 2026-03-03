import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';
import {
  BadgeCategory,
  BadgeLevel,
  BadgeMetric,
} from '#root/models/enum/enums.js';

const Badge = sequelize.define(
  'Badge',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    category: {
      type: DataTypes.ENUM(...Object.values(BadgeCategory)),
      allowNull: false,
    },

    level: {
      type: DataTypes.ENUM(...Object.values(BadgeLevel)),
      allowNull: true,
    },

    iconKey: {
      type: DataTypes.STRING(80),
      field: 'icon_key',
      allowNull: false,
    },

    threshold: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    metric: {
      type: DataTypes.ENUM(...Object.values(BadgeMetric)),
      allowNull: false,
    },

    accuracyRequired: {
      type: DataTypes.FLOAT,
      field: 'accuracy_required',
      allowNull: true,
    },
  },
  {
    tableName: 'badges',
    schema: 'public',
    timestamps: true,
    underscored: true,
  }
);

Badge.seed = async function () {
  try {
    const badges = [
      {
        key: 'challenge_3',
        name: 'First Steps',
        description: 'Complete 3 challenges',
        category: BadgeCategory.CHALLENGE_MILESTONE,
        level: BadgeLevel.BRONZE,
        iconKey: 'medal_bronze',
        threshold: 3,
        metric: BadgeMetric.CHALLENGES_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'challenge_5',
        name: 'On a Roll',
        description: 'Complete 5 challenges',
        category: BadgeCategory.CHALLENGE_MILESTONE,
        level: BadgeLevel.SILVER,
        iconKey: 'medal_silver',
        threshold: 5,
        metric: BadgeMetric.CHALLENGES_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'challenge_10',
        name: 'Challenge Veteran',
        description: 'Complete 10 challenges',
        category: BadgeCategory.CHALLENGE_MILESTONE,
        level: BadgeLevel.GOLD,
        iconKey: 'medal_gold',
        threshold: 10,
        metric: BadgeMetric.CHALLENGES_COMPLETED,
        accuracyRequired: null,
      },

      {
        key: 'review_3',
        name: 'Getting Involved',
        description: 'Complete 3 peer reviews',
        category: BadgeCategory.REVIEW_MILESTONE,
        level: BadgeLevel.BRONZE,
        iconKey: 'review_bronze_3',
        threshold: 3,
        metric: BadgeMetric.REVIEWS_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'review_5',
        name: 'Review Enthusiast',
        description: 'Complete 5 peer reviews',
        category: BadgeCategory.REVIEW_MILESTONE,
        level: BadgeLevel.BRONZE,
        iconKey: 'review_bronze_5',
        threshold: 5,
        metric: BadgeMetric.REVIEWS_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'review_10',
        name: 'Review Regular',
        description: 'Complete 10 peer reviews',
        category: BadgeCategory.REVIEW_MILESTONE,
        level: BadgeLevel.SILVER,
        iconKey: 'review_silver_10',
        threshold: 10,
        metric: BadgeMetric.REVIEWS_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'review_15',
        name: 'Review Expert',
        description: 'Complete 15 peer reviews',
        category: BadgeCategory.REVIEW_MILESTONE,
        level: BadgeLevel.SILVER,
        iconKey: 'review_silver_15',
        threshold: 15,
        metric: BadgeMetric.REVIEWS_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'review_20',
        name: 'Review Professional',
        description: 'Complete 20 peer reviews',
        category: BadgeCategory.REVIEW_MILESTONE,
        level: BadgeLevel.GOLD,
        iconKey: 'review_gold_20',
        threshold: 20,
        metric: BadgeMetric.REVIEWS_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'review_25',
        name: 'Review Veteran',
        description: 'Complete 25 peer reviews',
        category: BadgeCategory.REVIEW_MILESTONE,
        level: BadgeLevel.GOLD,
        iconKey: 'review_gold_25',
        threshold: 25,
        metric: BadgeMetric.REVIEWS_COMPLETED,
        accuracyRequired: null,
      },
      {
        key: 'reviewer_rookie',
        name: 'Reviewer Rookie',
        description: '5+ correct reviews with at least 80% accuracy',
        category: BadgeCategory.REVIEW_QUALITY,
        level: null,
        iconKey: 'quality_rookie',
        threshold: 5,
        metric: BadgeMetric.CORRECT_REVIEWS,
        accuracyRequired: 0.8,
      },
      {
        key: 'code_detective',
        name: 'Code Detective',
        description: 'Correctly identify 10 or more incorrect solutions',
        category: BadgeCategory.REVIEW_QUALITY,
        level: null,
        iconKey: 'quality_detective',
        threshold: 10,
        metric: BadgeMetric.ERRORS_FOUND,
        accuracyRequired: null,
      },
      {
        key: 'review_master_quality',
        name: 'Review Master',
        description: '25+ reviews with at least 90% accuracy',
        category: BadgeCategory.REVIEW_QUALITY,
        level: null,
        iconKey: 'quality_master',
        threshold: 25,
        metric: BadgeMetric.REVIEWS_COMPLETED,
        accuracyRequired: 0.9,
      },
    ];

    for (const badge of badges) {
      await Badge.findOrCreate({
        where: { key: badge.key },
        defaults: badge,
      });
    }
    console.log('Badge seeded successfully.');
  } catch (error) {
    console.error('Badge seeding failed:', error);
  }
};

export default Badge;
