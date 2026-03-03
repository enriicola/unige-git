import { DataTypes } from 'sequelize';
import { VoteType } from '#root/models/enum/enums.js';

const TABLE_NAME = 'peer_review_vote';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      TABLE_NAME,
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
          references: {
            model: 'peer_review_assignment',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        vote: {
          type: DataTypes.ENUM(...Object.values(VoteType)),
          allowNull: false,
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
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },

        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      },
      {
        schema: 'public',
        transaction,
      }
    );

    //not new insert for the same review, only update is allowed
    await queryInterface.addConstraint(TABLE_NAME, {
      fields: ['peer_review_assignment_id'],
      type: 'unique',
      name: 'uq_peer_review_vote_assignment',
      transaction,
    });

    await queryInterface.addIndex(TABLE_NAME, ['peer_review_assignment_id'], {
      name: 'peer_review_vote_assignment_id_idx',
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.dropTable(TABLE_NAME, {
      schema: 'public',
      transaction,
    });

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_peer_review_vote_vote";',
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
