import { DataTypes } from 'sequelize';

const TABLE_NAME = 'student_badges';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      TABLE_NAME,
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        studentId: {
          type: DataTypes.INTEGER,
          field: 'student_id',
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        badgeId: {
          type: DataTypes.INTEGER,
          field: 'badge_id',
          allowNull: false,
          references: { model: 'badges', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        earnedAt: {
          type: DataTypes.DATE,
          field: 'earned_at',
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },

        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },

        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      },
      { transaction }
    );

    await queryInterface.addConstraint(TABLE_NAME, {
      fields: ['student_id', 'badge_id'],
      type: 'unique',
      name: 'unique_student_badge',
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable(TABLE_NAME, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
