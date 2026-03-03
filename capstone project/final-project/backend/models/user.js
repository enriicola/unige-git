import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '#root/services/sequelize.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'student'),
      allowNull: false,
      defaultValue: 'student',
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    titleId: {
      field: 'title_id',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'users', // Plural is common for user tables to avoid conflict with 'user' reserved keyword in postgres
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
      {
        unique: true,
        fields: ['email'],
      },
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);
User.initializeRelations = function (models) {
  User.hasMany(models.ChallengeParticipant, {
    as: 'challengeJoins',
    foreignKey: 'studentId',
  });

  User.belongsToMany(models.Challenge, {
    through: models.ChallengeParticipant,
    as: 'joinedChallenges',
    foreignKey: 'studentId',
    otherKey: 'challengeId',
  });
  User.belongsTo(models.Title, {
    as: 'title',
    foreignKey: 'titleId',
  });
};
User.seed = async function () {
  try {
    const users = [
      {
        username: 'teacher1',
        email: 'teacher1@codymatch.test',
        password: 'password123',
        role: 'teacher',
        settings: { theme: 'light' },
      },
      {
        username: 'teacher2',
        email: 'teacher2@codymatch.test',
        password: 'password123',
        role: 'teacher',
        settings: { theme: 'dark' },
      },
      {
        username: 'student1',
        email: 'student1@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'dark' },
      },
      {
        username: 'student2',
        email: 'student2@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'light' },
      },
      {
        username: 'student3',
        email: 'student3@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'light' },
      },
      {
        username: 'student4',
        email: 'student4@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'light' },
      },
      {
        username: 'student5',
        email: 'student5@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'dark' },
      },
      {
        username: 'student6',
        email: 'student6@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'light' },
      },
      {
        username: 'student7',
        email: 'student7@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'light' },
      },
      {
        username: 'student8',
        email: 'student8@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'dark' },
      },
      {
        username: 'student9',
        email: 'student9@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'light' },
      },
      {
        username: 'student10',
        email: 'student10@codymatch.test',
        password: 'password123',
        role: 'student',
        settings: { theme: 'light' },
      },
    ];

    for (const data of users) {
      const [user] = await User.findOrCreate({
        where: { username: data.username },
        defaults: data,
      });

      let updated = false;
      if (!user.email) {
        user.email = data.email;
        updated = true;
      }

      if (user.password && !user.password.startsWith('$2')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    }

    console.log('Users seeded successfully.');
  } catch (error) {
    console.error('User seeding failed:', error);
  }
};

export default User;
