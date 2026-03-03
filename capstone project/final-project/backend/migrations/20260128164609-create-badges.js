import { Sequelize } from 'sequelize';
import {
  BadgeCategory,
  BadgeLevel,
  BadgeMetric,
} from '#root/models/enum/enums.js';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('badges', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    key: {
      type: Sequelize.STRING(80),
      allowNull: false,
      unique: true,
    },

    name: {
      type: Sequelize.STRING(80),
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },

    category: {
      type: Sequelize.ENUM(...Object.values(BadgeCategory)),
      allowNull: false,
    },

    level: {
      type: Sequelize.ENUM(...Object.values(BadgeLevel)),
      allowNull: true,
    },

    iconKey: {
      type: Sequelize.STRING(80),
      field: 'icon_key',
      allowNull: false,
    },

    threshold: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    metric: {
      type: Sequelize.ENUM(...Object.values(BadgeMetric)),
      allowNull: false,
    },

    accuracyRequired: {
      type: Sequelize.FLOAT,
      field: 'accuracy_required',
      allowNull: true,
    },

    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: new Date(),
    },

    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: new Date(),
    },
  });

  await queryInterface.addIndex('badges', ['category']);
  await queryInterface.addIndex('badges', ['metric']);
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('badges');
}
