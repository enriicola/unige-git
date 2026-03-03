const normalizeStatus = (value) => {
  const status = Number(value);
  return Number.isFinite(status) ? status : null;
};

const normalizeMessage = (value, fallback = 'Request failed') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (value?.message) return value.message;
  return fallback;
};

export const getApiErrorStatus = (value) => {
  if (!value) return null;
  if (typeof value === 'number') return normalizeStatus(value);
  return normalizeStatus(value?.status);
};

export const getApiErrorMessage = (value, fallback) => {
  if (!value) return normalizeMessage(null, fallback);
  return normalizeMessage(value?.message || value?.error || value, fallback);
};

export const isNotFoundError = (value) => getApiErrorStatus(value) === 404;

export const isForbiddenError = (value) => getApiErrorStatus(value) === 403;

export const isUnauthorizedError = (value) => getApiErrorStatus(value) === 401;
