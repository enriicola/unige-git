import _ from 'lodash';
import { Sequelize } from 'sequelize';
import databaseConfig from '#root/config/database.js';

const sequelize = new Sequelize(
  databaseConfig.name,
  databaseConfig.user,
  databaseConfig.password,
  databaseConfig.options
);

export const MAX_SEARCH_LEN = 300;

sequelize.wildcardEscape = (v) =>
  v == null ? '' : String(v).replace(/[%_\\]/g, '\\$&');

/*
  warning: escapeLike function is only for placeholders 'LIKE :key' usage inside safeLiteral.
  It must return the escaped string with surrounding quotes.
  For other usages, use sequelize.escape directly.
 */
sequelize.clamp = (v, max = MAX_SEARCH_LEN) =>
  v == null ? '' : String(v).trim().slice(0, max);

sequelize.sanitizeLike = (v, max = MAX_SEARCH_LEN) =>
  sequelize.wildcardEscape(sequelize.clamp(v, max));

const escapeLike = (v) => {
  if (!_.isString(v)) return sequelize.escape(v);
  return sequelize.escape(sequelize.sanitizeLike(v));
};

// escapeArray escapes each element of an array for usage in only IN clauses
const escapeArray = (arr) => {
  if (!_.isArray(arr)) return sequelize.escape(arr);
  if (arr.length === 0) return 'NULL';
  return arr.map((v) => sequelize.escape(v)).join(', ');
};
const makeKeyRegex = (key) => new RegExp(`(?<!:):${key}(?![A-Za-z0-9_])`, 'g');

sequelize.safeLiteral = (query, replacements = {}, likeKeys = []) => {
  let built = String(query);
  for (const [key, value] of Object.entries(replacements)) {
    const rendered = _.isArray(value)
      ? escapeArray(value)
      : likeKeys.includes(key)
        ? escapeLike(value)
        : sequelize.escape(value);
    built = built.replace(makeKeyRegex(key), rendered);
  }
  return sequelize.literal(built);
};

export default sequelize;
