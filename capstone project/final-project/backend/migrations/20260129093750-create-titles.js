import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.createTable(
      'titles',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        key: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },

        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },

        description: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },

        rank: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
        },

        min_challenges: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        min_avg_score: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },

        min_badges: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: new Date(),
        },

        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: new Date(),
        },
      },
      { transaction }
    );

    await queryInterface.addIndex('titles', ['rank'], { transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function down({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable('titles', { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
