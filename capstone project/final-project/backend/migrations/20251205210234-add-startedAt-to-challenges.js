import { DataTypes } from 'sequelize';
export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('challenge', 'startedAt', {
    type: DataTypes.DATE,
    allowNull: true,
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('challenge', 'startedAt');
}
