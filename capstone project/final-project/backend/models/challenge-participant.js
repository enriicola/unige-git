import sequelize from '#root/services/sequelize.js';
import { DataTypes } from 'sequelize';

const ChallengeParticipant = sequelize.define(
  'ChallengeParticipant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'challenge_id',
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id',
    },
  },
  {
    tableName: 'challenge_participant',
    schema: 'public',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['challenge_id', 'student_id'],
      },
    ],
  }
);

ChallengeParticipant.initializeRelations = (models) => {
  ChallengeParticipant.belongsTo(models.Challenge, {
    foreignKey: 'challengeId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ChallengeParticipant.belongsTo(models.User, {
    as: 'student',
    foreignKey: 'studentId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ChallengeParticipant.hasOne(models.Match, {
    as: 'match',
    foreignKey: 'challengeParticipantId',
  });
  ChallengeParticipant.hasMany(models.Submission, {
    as: 'submissions',
    foreignKey: 'challengeParticipantId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ChallengeParticipant.hasMany(models.PeerReviewAssignment, {
    as: 'assignedReviews',
    foreignKey: 'reviewerId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ChallengeParticipant.hasOne(models.SubmissionScoreBreakdown, {
    as: 'scoreBreakdown',
    foreignKey: 'challengeParticipantId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

ChallengeParticipant.seed = async function () {
  try {
    const count = await ChallengeParticipant.count();
    if (count > 0) return;

    const { default: Challenge } = await import('./challenge.js');
    const { default: User } = await import('./user.js');

    const challenge = await Challenge.findOne({ order: [['id', 'ASC']] });
    const students = await User.findAll({
      where: { role: 'student' },
      order: [['id', 'ASC']],
      limit: 10,
    });

    // Exclude 'student1' from joining the challenge only for seeding purposes and for sprint demo
    const studentsToJoin = students.filter(
      (student) => student.username !== 'student1'
    );

    if (!challenge || studentsToJoin.length === 0) {
      console.warn(
        'ChallengeParticipant seeding skipped: missing challenge or students'
      );
      return;
    }

    const rows = studentsToJoin.map((student) => ({
      challengeId: challenge.id,
      studentId: student.id,
    }));

    await ChallengeParticipant.bulkCreate(rows);

    console.log('ChallengeParticipant seeded successfully.');
  } catch (error) {
    console.error('ChallengeParticipant seeding failed:', error);
  }
};

export default ChallengeParticipant;
