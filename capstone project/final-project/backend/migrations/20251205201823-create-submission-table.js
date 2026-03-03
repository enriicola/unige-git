import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      'submission',
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
          references: {
            model: 'match',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        challengeParticipantId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'challenge_participant_id',
          references: {
            model: 'challenge_participant',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        code: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        submissions_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
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

    // Create index on match_id for faster lookups
    await queryInterface.addIndex('submission', ['match_id'], {
      name: 'submission_match_id_idx',
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
    await queryInterface.dropTable('submission', {
      schema: 'public',
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
