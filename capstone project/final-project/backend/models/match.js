import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';

const Match = sequelize.define(
  'Match',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    challengeMatchSettingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'challenge_match_setting_id',
    },
    challengeParticipantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'challenge_participant_id',
    },
  },
  {
    tableName: 'match',
    schema: 'public',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'match_pkey',
        unique: true,
        fields: ['id'],
      },
      {
        name: 'uq_match_challenge_match_setting_participant',
        unique: true,
        fields: ['challenge_match_setting_id', 'challenge_participant_id'],
      },
      {
        name: 'uq_match_challenge_participant_id',
        unique: true,

        fields: ['challenge_participant_id'],
      },
    ],
  }
);

Match.initializeRelations = (models) => {
  Match.belongsTo(models.ChallengeMatchSetting, {
    as: 'challengeMatchSetting',
    foreignKey: 'challengeMatchSettingId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Match.belongsTo(models.ChallengeParticipant, {
    as: 'challengeParticipant',
    foreignKey: 'challengeParticipantId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Match.hasMany(models.Submission, {
    as: 'submissions',
    foreignKey: 'matchId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default Match;
