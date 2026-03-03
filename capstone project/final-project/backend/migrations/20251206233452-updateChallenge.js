import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn(
      'challenge',
      'startPhaseOneDateTime',
      { type: DataTypes.DATE, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'challenge',
      'endPhaseOneDateTime',
      { type: DataTypes.DATE, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'challenge',
      'startPhaseTwoDateTime',
      { type: DataTypes.DATE, allowNull: true },
      { transaction }
    );
    await queryInterface.addColumn(
      'challenge',
      'endPhaseTwoDateTime',
      { type: DataTypes.DATE, allowNull: true },
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
    await queryInterface.removeColumn('challenge', 'startPhaseOneDateTime', {
      transaction,
    });
    await queryInterface.removeColumn('challenge', 'endPhaseOneDateTime', {
      transaction,
    });
    await queryInterface.removeColumn('challenge', 'startPhaseTwoDateTime', {
      transaction,
    });
    await queryInterface.removeColumn('challenge', 'endPhaseTwoDateTime', {
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
