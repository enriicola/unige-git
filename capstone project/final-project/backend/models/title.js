import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';

const Title = sequelize.define(
  'Title',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    minChallenges: {
      type: DataTypes.INTEGER,
      field: 'min_challenges',
      allowNull: false,
      defaultValue: 0,
    },

    minAvgScore: {
      type: DataTypes.FLOAT,
      field: 'min_avg_score',
      allowNull: false,
      defaultValue: 0,
    },

    minBadges: {
      type: DataTypes.INTEGER,
      field: 'min_badges',
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'titles',
    schema: 'public',
    timestamps: true,
    underscored: true,
  }
);
Title.seed = async function () {
  try {
    const titles = [
      {
        key: 'newbie',
        name: 'Newbie',
        description: 'Just getting started',
        rank: 1,
        minChallenges: 0,
        minAvgScore: 0,
        minBadges: 0,
      },
      {
        key: 'pupil',
        name: 'Pupil',
        description: 'Developing fundamentals',
        rank: 2,
        minChallenges: 3,
        minAvgScore: 50,
        minBadges: 0,
      },
      {
        key: 'specialist',
        name: 'Specialist',
        description: 'Building solid expertise',
        rank: 3,
        minChallenges: 15,
        minAvgScore: 70,
        minBadges: 3,
      },
      {
        key: 'expert',
        name: 'Expert',
        description: 'Skilled coder with proven excellence',
        rank: 4,
        minChallenges: 30,
        minAvgScore: 80,
        minBadges: 10,
      },
      {
        key: 'master',
        name: 'Master',
        description: 'Top-tier problem solver with exceptional achievement',
        rank: 5,
        minChallenges: 50,
        minAvgScore: 85,
        minBadges: 20,
      },
    ];

    for (const title of titles) {
      await Title.findOrCreate({
        where: { key: title.key },
        defaults: title,
      });
    }

    console.log('Titles seeded successfully.');
  } catch (error) {
    console.error('Titles seeding failed:', error);
  }
};

export default Title;
