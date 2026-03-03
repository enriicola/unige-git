import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';

const StudentBadge = sequelize.define(
  'StudentBadge',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id',
    },

    badgeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'badge_id',
    },

    earnedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'earned_at',
    },
  },
  {
    tableName: 'student_badges',
    schema: 'public',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'student_badges_pkey',
        unique: true,
        fields: ['id'],
      },
      {
        name: 'unique_student_badge',
        unique: true,
        fields: ['student_id', 'badge_id'],
      },
    ],
  }
);

StudentBadge.initializeRelations = (models) => {
  StudentBadge.belongsTo(models.User, {
    as: 'student',
    foreignKey: 'studentId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  StudentBadge.belongsTo(models.Badge, {
    as: 'badge',
    foreignKey: 'badgeId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default StudentBadge;
