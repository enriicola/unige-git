export const errorTypes = {
  ValidationError: 'ValidationError',
  SequelizeUniqueConstraintError: 'SequelizeUniqueConstraintError',
  NotExistsError: 'NotExistsError',
  NotFoundError: 'NotFoundError',
  VerificationError: 'VerificationError',
  UnverificationError: 'UnverificationError',
  UnverificationAlreadyVerifiedError: 'UnverificationAlreadyVerifiedError',
};

export const inputErrors = [
  errorTypes.ValidationError,
  errorTypes.SequelizeUniqueConstraintError,
  errorTypes.NotExistsError,
];

export const verificationErrors = [errorTypes.VerificationError];

export const unverificationErrors = [
  errorTypes.ValidationError,
  errorTypes.UnverificationError,
  errorTypes.UnverificationAlreadyVerifiedError,
];

export function handleException(res, error, errorsGroup = [], code = 400) {
  // Ensure error is serializable
  const errorResponse = {
    message: error?.message || error?.toString() || 'An error occurred',
  };

  if (error?.type) {
    errorResponse.type = error.type;
  }

  if (error?.name) {
    errorResponse.name = error.name;
  }

  if (process.env.NODE_ENV === 'development' && error?.stack) {
    errorResponse.stack = error.stack;
  }

  if (errorsGroup.includes(error?.type)) {
    res.status(code).json({ success: false, error: errorResponse });
  } else {
    res.status(500).json({ success: false, error: errorResponse });
  }
}
