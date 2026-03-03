import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.addColumn(
      'users',
      'email',
      {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      { transaction }
    );

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "email" = CONCAT(username, '@codymatch.test') WHERE "email" IS NULL OR "email" = ''`,
      { transaction }
    );

    await queryInterface.changeColumn(
      'users',
      'email',
      {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      { transaction }
    );

    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'users_email_unique',
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
    await queryInterface.removeConstraint('users', 'users_email_unique', {
      transaction,
    });
    await queryInterface.removeColumn('users', 'email', { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
