import { EvaluationStatus } from '#root/models/enum/enums.js';
import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn(
      'peer_review_vote',
      'reference_output',
      { type: DataTypes.TEXT, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'peer_review_vote',
      'actual_output',
      { type: DataTypes.TEXT, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'peer_review_vote',
      'is_expected_output_correct',
      { type: DataTypes.BOOLEAN, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'peer_review_vote',
      'is_bug_proven',
      { type: DataTypes.BOOLEAN, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'peer_review_vote',
      'is_vote_correct',
      { type: DataTypes.BOOLEAN, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'peer_review_vote',
      'evaluation_status',
      {
        type: DataTypes.ENUM(...Object.values(EvaluationStatus)),
        allowNull: true,
      },
      { transaction }
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
    await queryInterface.removeColumn('peer_review_vote', 'reference_output', {
      transaction,
    });
    await queryInterface.removeColumn('peer_review_vote', 'actual_output', {
      transaction,
    });
    await queryInterface.removeColumn(
      'peer_review_vote',
      'is_expected_output_correct',
      {
        transaction,
      }
    );
    await queryInterface.removeColumn('peer_review_vote', 'is_bug_proven', {
      transaction,
    });
    await queryInterface.removeColumn('peer_review_vote', 'is_vote_correct', {
      transaction,
    });
    await queryInterface.removeColumn('peer_review_vote', 'evaluation_status', {
      transaction,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
