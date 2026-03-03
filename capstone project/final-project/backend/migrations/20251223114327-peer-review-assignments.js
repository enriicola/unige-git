import { DataTypes } from 'sequelize';

const TABLE_NAME = 'peer_review_assignment';

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

        submissionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'submission_id',
          references: {
            model: 'submission',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        reviewerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'reviewer_id',
          references: {
            model: 'challenge_participant',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        isExtra: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_extra',
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
    await queryInterface.addConstraint(TABLE_NAME, {
      fields: ['submission_id', 'reviewer_id'],
      type: 'unique',
      name: 'uq_peer_review_assignment_submission_reviewer',
      transaction,
    });
    await queryInterface.addIndex(TABLE_NAME, ['submission_id'], {
      name: 'peer_review_assignment_submission_id_idx',
      transaction,
    });

    await queryInterface.addIndex(TABLE_NAME, ['reviewer_id'], {
      name: 'peer_review_assignment_reviewer_id_idx',
      transaction,
    });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function down({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable(TABLE_NAME, {
      schema: 'public',
      transaction,
    });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
