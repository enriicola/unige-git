import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';
import { MatchSettingStatus } from './enum/enums.js';

const MatchSetting = sequelize.define(
  'MatchSetting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    problemTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    problemDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    referenceSolution: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'reference_solution',
    },
    publicTests: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    privateTests: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(MatchSettingStatus)),
      allowNull: false,
      defaultValue: 'draft',
    },
  },

  {
    tableName: 'match_setting',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: 'match_setting_pkey',
        unique: true,
        fields: [{ name: 'id' }],
      },
    ],
  }
);

MatchSetting.initializeRelations = function (models) {
  MatchSetting.belongsToMany(models.Challenge, {
    through: 'ChallengeMatchSetting',
    as: 'challenges',
    foreignKey: 'matchSettingId',
    otherKey: 'challengeId',
  });
  MatchSetting.hasMany(models.ChallengeMatchSetting, {
    as: 'challengeMatchSettings',
    foreignKey: 'matchSettingId',
  });
};
MatchSetting.seed = async function () {
  try {
    const count = await MatchSetting.count();
    console.log('Current MatchSetting count:', count);
    if (count > 0) return;

    await MatchSetting.bulkCreate([
      {
        problemTitle: 'Two Sum',
        problemDescription:
          'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        referenceSolution: `
          function twoSum(nums, target) {
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
              const complement = target - nums[i];
              if (map.has(complement)) {
                return [map.get(complement), i];
              }
              map.set(nums[i], i);
            }
            return [];
          }
      `,
        publicTests: [
          { input: [[2, 7, 11, 15], 9], output: [0, 1] },
          { input: [[3, 2, 4], 6], output: [1, 2] },
        ],
        privateTests: [{ input: [[3, 3], 6], output: [0, 1] }],
        status: MatchSettingStatus.READY,
      },

      {
        problemTitle: 'Palindrome Number',
        problemDescription:
          'Given an integer x, return true if x is a palindrome, and false otherwise.',
        referenceSolution: `
          function isPalindrome(x) {
            if (x < 0) return false;
            const s = String(x);
            return s === s.split('').reverse().join('');
          }
        `,
        publicTests: [
          { input: 121, output: true },
          { input: 123, output: false },
        ],
        privateTests: [{ input: 10, output: false }],
        status: MatchSettingStatus.READY,
      },

      {
        problemTitle: 'Valid Parentheses',
        problemDescription:
          'Given a string s containing only characters (), {}, [], determine if the string is valid. A string is valid if brackets close in the correct order.',
        referenceSolution: `
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}
        `,
        publicTests: [
          { input: ['()'], output: true },
          { input: ['()[]{}'], output: true },
          { input: ['(]'], output: false },
        ],
        privateTests: [
          { input: ['([{}])'], output: true },
          { input: ['((()))[]'], output: true },
          { input: ['([)]'], output: false },
        ],
        status: 'ready',
      },
    ]);

    console.log('MatchSettings seeded successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

export default MatchSetting;
