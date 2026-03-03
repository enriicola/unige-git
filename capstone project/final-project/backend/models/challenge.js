import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';
import getValidator from '#root/services/validator.js';
import { errorTypes } from '#root/services/error.js';
import { ChallengeStatus } from '#root/models/enum/enums.js';

export async function validateChallengeData(
  data,
  { validatorKey = 'challenge' } = {}
) {
  const validate = getValidator(validatorKey);

  if (!validate) {
    throw new Error(`Validator not found for key: ${validatorKey}`);
  }

  const isValid = validate(data);

  if (!isValid) {
    const details =
      validate.errors?.map((e) => `${e.instancePath} ${e.message}`) || [];
    const error = new Error('Challenge validation error');
    error.name = errorTypes?.VALIDATION_ERROR || 'validationError';
    error.status = 400;
    error.details = details;
    throw error;
  }
}

const Challenge = sequelize.define(
  'Challenge',
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDatetime: {
      type: DataTypes.DATE,
      field: 'start_datetime',
      allowNull: false,
    },
    endDatetime: {
      type: DataTypes.DATE,
      field: 'end_datetime',
      allowNull: false,
    },
    durationPeerReview: {
      type: DataTypes.INTEGER,
      field: 'duration_peer_review',
      allowNull: false,
    },
    allowedNumberOfReview: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ChallengeStatus)),
      allowNull: false,
      defaultValue: 'private',
    },
    scoringStatus: {
      type: DataTypes.ENUM('pending', 'computing', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'scoring_status',
    },
    startPhaseOneDateTime: {
      type: DataTypes.DATE,
      field: 'startPhaseOneDateTime',
      allowNull: true,
    },
    endPhaseOneDateTime: {
      type: DataTypes.DATE,
      field: 'endPhaseOneDateTime',
      allowNull: true,
    },
    startPhaseTwoDateTime: {
      type: DataTypes.DATE,
      field: 'startPhaseTwoDateTime',
      allowNull: true,
    },
    endPhaseTwoDateTime: {
      type: DataTypes.DATE,
      field: 'endPhaseTwoDateTime',
      allowNull: true,
    },
    phaseOneFinalizationCompletedAt: {
      type: DataTypes.DATE,
      field: 'phase_one_finalization_completed_at',
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'challenge',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: 'challenge_pkey',
        unique: true,
        fields: [{ name: 'id' }],
      },
      {
        name: 'challenge_start_datetime_idx',
        fields: [{ name: 'start_datetime' }],
      },
    ],
  }
);

Challenge.initializeRelations = function (models) {
  Challenge.belongsToMany(models.MatchSetting, {
    through: 'ChallengeMatchSetting',
    as: 'matchSettings',
    foreignKey: 'challengeId',
    otherKey: 'matchSettingId',
  });

  Challenge.hasMany(models.ChallengeParticipant, {
    as: 'challengeParticipants',
    foreignKey: 'challengeId',
  });

  Challenge.belongsToMany(models.User, {
    through: models.ChallengeParticipant,
    as: 'participants',
    foreignKey: 'challengeId',
    otherKey: 'studentId',
  });
  Challenge.hasMany(models.ChallengeMatchSetting, {
    as: 'challengeMatchSettings',
    foreignKey: 'challengeId',
  });
};

Challenge.getDefaultOrder = function () {
  return [
    // Use the actual DB column to avoid alias/field mapping issues in ORDER BY
    [sequelize.literal('"Challenge"."start_datetime"'), 'DESC'],
    ['id', 'DESC'],
  ];
};

Challenge.getDefaultIncludes = function () {
  return [
    {
      association: 'creator',
    },
    {
      association: 'matchSettings',
    },
    {
      association: 'matches',
    },
    {
      association: 'participants',
    },
  ];
};

Challenge.createWithValidation = async function (payload, options = {}) {
  await validateChallengeData(payload, { validatorKey: 'challenge' });
  return Challenge.create(payload, options);
};

Challenge.seed = async function () {
  // try {
  //   const count = await Challenge.count();
  //   if (count > 0) return;
  //   await Challenge.createWithValidation({
  //     title: 'Intro to Loops',
  //     duration: 2,
  //     startDatetime: '2025-12-01T09:00:00Z',
  //     endDatetime: '2025-12-01T10:00:00Z',
  //     durationPeerReview: 60,
  //     allowedNumberOfReview: 3,
  //     status: 'public',
  //   });
  //   console.log('Challenge seeded successfully.');
  // } catch (error) {
  //   console.error('Challenge seeding failed:', error);
  // }
};
export default Challenge;
