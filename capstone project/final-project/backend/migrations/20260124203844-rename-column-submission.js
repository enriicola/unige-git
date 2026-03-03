export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.renameColumn(
      'submission',
      'publicTestResults',
      'public_test_results',
      { transaction }
    );

    await queryInterface.renameColumn(
      'submission',
      'privateTestResults',
      'private_test_results',
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
    await queryInterface.renameColumn(
      'submission',
      'public_test_results',
      'publicTestResults',
      { transaction }
    );

    await queryInterface.renameColumn(
      'submission',
      'private_test_results',
      'privateTestResults',
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
