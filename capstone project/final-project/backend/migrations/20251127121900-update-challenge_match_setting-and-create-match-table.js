import { DataTypes } from 'sequelize';

const OLD_TABLE = 'ChallengeMatchSetting';
const NEW_TABLE = 'challenge_match_setting';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.removeConstraint(
      OLD_TABLE,
      'ChallengeMatchSetting_pkey',
      {
        transaction,
      }
    );

    await queryInterface.addColumn(
      OLD_TABLE,
      'id',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      { transaction }
    );

    await queryInterface.addConstraint(OLD_TABLE, {
      fields: ['id'],
      type: 'primary key',
      name: 'challenge_match_setting_pkey',
      transaction,
    });

    await queryInterface.addConstraint(OLD_TABLE, {
      fields: ['challenge_id', 'match_setting_id'],
      type: 'unique',
      name: 'uq_challenge_match_setting_ids',
      transaction,
    });

    await queryInterface.renameTable(OLD_TABLE, NEW_TABLE, { transaction });

    await queryInterface.createTable(
      'match',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        challenge_match_setting_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: NEW_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        challenge_participant_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'challenge_participant',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.addConstraint('match', {
      fields: ['challenge_participant_id'],
      type: 'unique',
      name: 'uq_match_challenge_participant_id',
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
    await queryInterface.dropTable('match', { transaction });

    await queryInterface.renameTable(NEW_TABLE, OLD_TABLE, { transaction });

    await queryInterface.removeConstraint(
      OLD_TABLE,
      'challenge_match_setting_pkey',
      {
        transaction,
      }
    );
    await queryInterface.removeConstraint(
      OLD_TABLE,
      'uq_challenge_match_setting_ids',
      {
        transaction,
      }
    );

    await queryInterface.removeColumn(OLD_TABLE, 'id', { transaction });

    await queryInterface.addConstraint(OLD_TABLE, {
      fields: ['challenge_id', 'match_setting_id'],
      type: 'primary key',
      name: 'ChallengeMatchSetting_pkey',
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
