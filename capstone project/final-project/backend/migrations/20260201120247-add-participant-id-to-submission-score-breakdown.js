import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn(
      'submission_score_breakdown',
      'challenge_participant_id',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'challenge_participant',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      { transaction }
    );

    await queryInterface.sequelize.query(
      `
        UPDATE submission_score_breakdown
        SET challenge_participant_id = submission.challenge_participant_id
          FROM submission
        WHERE submission_score_breakdown.submission_id = submission.id
      `,
      { transaction }
    );

    await queryInterface.changeColumn(
      'submission_score_breakdown',
      'challenge_participant_id',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      { transaction }
    );

    await queryInterface.changeColumn(
      'submission_score_breakdown',
      'submission_id',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      { transaction }
    );

    try {
      await queryInterface.removeIndex(
        'submission_score_breakdown',
        'uq_submission_score_breakdown_submission_id',
        { transaction }
      );
    } catch (e) {
      console.log(
        'Index might not exist or has different name, skipping removal'
      );
    }

    await queryInterface.addIndex(
      'submission_score_breakdown',
      ['challenge_participant_id'],
      {
        unique: true,
        name: 'uq_submission_score_breakdown_participant_id',
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.removeIndex(
      'submission_score_breakdown',
      'uq_submission_score_breakdown_participant_id',
      { transaction }
    );

    await queryInterface.addIndex(
      'submission_score_breakdown',
      ['submission_id'],
      {
        unique: true,
        name: 'uq_submission_score_breakdown_submission_id',
        transaction,
      }
    );

    await queryInterface.removeColumn(
      'submission_score_breakdown',
      'challenge_participant_id',
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
