import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn(
      'challenge',
      'scoring_status',
      {
        type: DataTypes.ENUM('pending', 'computing', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
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
    await queryInterface.removeColumn('challenge', 'scoring_status', {
      transaction,
    });

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_challenge_scoring_status";',
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
