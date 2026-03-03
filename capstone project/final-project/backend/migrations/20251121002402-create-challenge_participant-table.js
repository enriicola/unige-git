import { Sequelize } from 'sequelize';

const TABLE_NAME = 'challenge_participant';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    challengeId: {
      type: Sequelize.INTEGER,
      field: 'challenge_id',
      allowNull: false,
      references: {
        model: 'challenge',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    studentId: {
      type: Sequelize.INTEGER,
      field: 'student_id',
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addConstraint(TABLE_NAME, {
    fields: ['challenge_id', 'student_id'],
    type: 'unique',
    name: 'uq_student_challenge_ids',
  });
}

export async function down({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable(TABLE_NAME, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
