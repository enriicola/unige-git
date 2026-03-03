import { Model, DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';

class SubmissionScoreBreakdown extends Model {}

SubmissionScoreBreakdown.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    challengeParticipantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'challenge_participant_id',
    },

    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'submission_id',
    },
    codeReviewScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'code_review_score',
    },
    implementationScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'implementation_score',
    },
    totalScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'total_score',
    },

    stats: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'stats',
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
    modelName: 'SubmissionScoreBreakdown',
    tableName: 'submission_score_breakdown',
    schema: 'public',
    underscored: true,
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ['challenge_participant_id'],
        name: 'uq_submission_score_breakdown_participant_id',
      },
    ],
  }
);

SubmissionScoreBreakdown.initializeRelations = (models) => {
  SubmissionScoreBreakdown.belongsTo(models.Submission, {
    as: 'submission',
    foreignKey: 'submissionId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  SubmissionScoreBreakdown.belongsTo(models.ChallengeParticipant, {
    as: 'challengeParticipant',
    foreignKey: 'challengeParticipantId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default SubmissionScoreBreakdown;
