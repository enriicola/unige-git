import { Model, DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';
import { SubmissionStatus } from '#root/models/enum/enums.js';

class Submission extends Model {}

Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'match_id',
    },
    challengeParticipantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'challenge_participant_id',
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SubmissionStatus)),
      allowNull: true,
    },
    isAutomaticSubmission: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_automatic_submission',
      defaultValue: false,
    },
    isFinal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_final',
      defaultValue: false,
    },
    publicTestResults: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    privateTestResults: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Submission',
    tableName: 'submission',
    schema: 'public',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'idx_match_submission_match_id',

        fields: ['match_id'],
      },
      {
        name: 'idx_match_submission_challenge_participant_id',

        fields: ['challenge_participant_id'],
      },
    ],
  }
);

Submission.initializeRelations = (models) => {
  Submission.belongsTo(models.Match, {
    as: 'match',
    foreignKey: 'matchId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Submission.belongsTo(models.ChallengeParticipant, {
    as: 'challengeParticipant',
    foreignKey: 'challengeParticipantId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Submission.hasMany(models.PeerReviewAssignment, {
    as: 'peerReviewAssignments',
    foreignKey: 'submissionId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  if (models.SubmissionScoreBreakdown) {
    Submission.hasOne(models.SubmissionScoreBreakdown, {
      as: 'scoreBreakdown',
      foreignKey: 'submissionId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
};

export default Submission;
