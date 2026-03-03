import { DataTypes } from 'sequelize';

const TABLE_NAME = 'submission_score_breakdown';

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

        submissionId: {
          type: DataTypes.INTEGER,
          field: 'submission_id',
          allowNull: false,
          unique: true,
          references: {
            model: 'submission',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        codeReviewScore: {
          type: DataTypes.FLOAT,
          field: 'code_review_score',
          allowNull: false,
        },

        implementationScore: {
          type: DataTypes.FLOAT,
          field: 'implementation_score',
          allowNull: false,
        },

        totalScore: {
          type: DataTypes.FLOAT,
          field: 'total_score',
          allowNull: false,
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
      {
        schema: 'public',
        transaction,
      }
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
    await queryInterface.dropTable(TABLE_NAME, {
      schema: 'public',
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
