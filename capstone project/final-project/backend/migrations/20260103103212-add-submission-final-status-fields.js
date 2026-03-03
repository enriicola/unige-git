import { DataTypes } from 'sequelize';
import { SubmissionStatus } from '#root/models/enum/enums.js';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn(
      'submission',
      'is_automatic_submission',
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      { transaction }
    );

    await queryInterface.addColumn(
      'submission',
      'is_final',
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      { transaction }
    );

    await queryInterface.addColumn(
      'submission',
      'status',
      {
        type: DataTypes.ENUM(...Object.values(SubmissionStatus)),
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
    await queryInterface.removeColumn('submission', 'status', { transaction });
    await queryInterface.removeColumn('submission', 'is_final', {
      transaction,
    });
    await queryInterface.removeColumn('submission', 'is_automatic_submission', {
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
