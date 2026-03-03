import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';

const ChallengeMatchSetting = sequelize.define(
  'ChallengeMatchSetting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'challenge_id',
    },
    matchSettingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'match_setting_id',
    },
  },
  {
    tableName: 'challenge_match_setting',
    schema: 'public',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'challenge_match_setting_pkey',
        unique: true,
        fields: ['id'],
      },
      {
        name: 'uq_challenge_match_setting_ids',
        unique: true,
        fields: ['challenge_id', 'match_setting_id'],
      },
    ],
  }
);

ChallengeMatchSetting.initializeRelations = (models) => {
  ChallengeMatchSetting.belongsTo(models.Challenge, {
    as: 'challenge',
    foreignKey: 'challengeId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ChallengeMatchSetting.belongsTo(models.MatchSetting, {
    as: 'matchSetting',
    foreignKey: 'matchSettingId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ChallengeMatchSetting.hasMany(models.Match, {
    as: 'match',
    foreignKey: 'challengeMatchSettingId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

ChallengeMatchSetting.seed = async function () {
  try {
    const count = await ChallengeMatchSetting.count();
    if (count > 0) return;

    const { default: Challenge } = await import('./challenge.js');
    const { default: MatchSetting } = await import('./match-setting.js');

    const challenge = await Challenge.findOne({ order: [['id', 'ASC']] });
    const matchSettings = await MatchSetting.findAll({
      order: [['id', 'ASC']],
      limit: 3,
    });

    if (!challenge || matchSettings.length === 0) {
      console.warn(
        'ChallengeMatchSetting seeding skipped: missing challenge or match settings'
      );
      return;
    }

    const rows = matchSettings.map((ms) => ({
      challengeId: challenge.id,
      matchSettingId: ms.id,
    }));

    await ChallengeMatchSetting.bulkCreate(rows);

    console.log('ChallengeMatchSetting seeded successfully.');
  } catch (error) {
    console.error('ChallengeMatchSetting seeding failed:', error);
  }
};

export default ChallengeMatchSetting;
