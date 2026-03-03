import { Model, DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';
import { VoteType, EvaluationStatus } from '#root/models/enum/enums.js';

class PeerReviewVote extends Model {}

PeerReviewVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    peerReviewAssignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'peer_review_assignment_id',
    },
    vote: {
      type: DataTypes.ENUM(...Object.values(VoteType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(VoteType)],
          msg: 'Vote must be valid (correct, incorrect, abstain)',
        },
      },
    },
    testCaseInput: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'test_case_input',
    },
    expectedOutput: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'expected_output',
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
    referenceOutput: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reference_output',
    },
    actualOutput: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'actual_output',
    },
    isExpectedOutputCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_expected_output_correct',
    },
    isBugProven: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_bug_proven',
    },
    isVoteCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_vote_correct',
    },
    evaluationStatus: {
      type: DataTypes.ENUM(...Object.values(EvaluationStatus)),
      allowNull: true,
      field: 'evaluation_status',
    },
  },
  {
    sequelize,
    modelName: 'PeerReviewVote',
    tableName: 'peer_review_vote',
    schema: 'public',
    underscored: true,
    timestamps: true,

    validate: {
      checkIncorrectVoteRequirements() {
        if (this.vote === VoteType.INCORRECT) {
          if (!this.testCaseInput || !this.testCaseInput.trim()) {
            throw new Error(
              'Test case input is required when voting Incorrect.'
            );
          }
          if (!this.expectedOutput || !this.expectedOutput.trim()) {
            throw new Error(
              'Expected output is required when voting Incorrect.'
            );
          }

          try {
            const inputArr = JSON.parse(this.testCaseInput);
            const outputArr = JSON.parse(this.expectedOutput);
            if (!Array.isArray(inputArr) || !Array.isArray(outputArr)) {
              throw new Error('Format Invalid');
            }
          } catch (e) {
            throw new Error(
              'Input and output must be valid array values (e.g., [1,2,4]).'
            );
          }
        }
      },
    },

    indexes: [
      {
        unique: true,
        fields: ['peer_review_assignment_id'],
        name: 'uq_peer_review_vote_assignment',
      },
    ],
  }
);

PeerReviewVote.initializeRelations = (models) => {
  PeerReviewVote.belongsTo(models.PeerReviewAssignment, {
    as: 'assignment',
    foreignKey: 'peerReviewAssignmentId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default PeerReviewVote;
