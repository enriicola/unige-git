import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.removeColumn('challenge', 'started_at');
}

export async function down({ context: queryInterface }) {
  await queryInterface.addColumn('challenge', 'started_at', {
    type: DataTypes.DATE,
    allowNull: true,
  });
}
