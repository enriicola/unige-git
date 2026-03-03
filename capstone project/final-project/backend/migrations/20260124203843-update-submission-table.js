import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn(
      'submission',
      'publicTestResults',
      { type: DataTypes.TEXT, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'submission',
      'privateTestResults',
      { type: DataTypes.TEXT, allowNull: true },
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
    await queryInterface.removeColumn('submission', 'publicTestResults', {
      transaction,
    });
    await queryInterface.removeColumn('submission', 'privateTestResults', {
      transaction,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
