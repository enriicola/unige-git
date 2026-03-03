import logger from '#root/services/logger.js';
import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from '#root/services/sequelize.js';

const initMigrator = () =>
  new Umzug({
    migrations: { glob: 'migrations/*.js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
  });

const up = async () => {
  try {
    const migrator = initMigrator();
    const result = await migrator.up();
    logger.debug(
      `Migrated ${result.length} file${result.length === 1 ? '' : 's'}`
    );
  } catch (e) {
    logger.error(`Migration failed: ${e.message}`);
    throw e;
  }
};

const down = async () => {
  try {
    const migrator = initMigrator();
    const result = await migrator.down();
    logger.debug(
      `Rolled back ${result.length} file${result.length === 1 ? '' : 's'}`
    );
  } catch (e) {
    logger.error(`Rollback failed: ${e.message}`);
    throw e;
  }
};
const downAll = async () => {
  try {
    const migrator = initMigrator();
    const result = await migrator.down({ to: 0 });
    logger.debug(
      `Rolled back ${result.length} file${result.length === 1 ? '' : 's'}`
    );
  } catch (e) {
    logger.error(`Rollback all failed: ${e.message}`);
    throw e;
  }
};
export { up, down, downAll };
