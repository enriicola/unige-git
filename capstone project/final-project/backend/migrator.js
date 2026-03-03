import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';

import databaseConfig from '#root/config/database.js';

const sequelize = new Sequelize(
  databaseConfig.name,
  databaseConfig.user,
  databaseConfig.password,
  databaseConfig.options
);

const init = async () => {
  // Only accept with the following arguments:
  switch (true) {
    case process.argv.length === 3 && process.argv[2] === 'db:migrate':
    case process.argv.length === 3 && process.argv[2] === 'db:migrate:undo':
    case process.argv.length === 3 && process.argv[2] === 'db:migrate:undo:all':
      break;
    default:
      return;
  }

  try {
    const migrator = new Umzug({
      migrations: { glob: 'migrations/*.js' },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
    });
    let result = [];
    switch (true) {
      case process.argv[2] === 'db:migrate':
        result = await migrator.up();
        console.log(
          `Migrated ${result.length} file${result.length === 1 ? '' : 's'}`
        );
        break;
      case process.argv[2] === 'db:migrate:undo':
        result = await migrator.down();
        console.log(
          `Rolled back ${result.length} migration${
            result.length === 1 ? '' : 's'
          }`
        );
        break;
      case process.argv[2] === 'db:migrate:undo:all':
        result = await migrator.down({ to: 0 });
        console.log(
          `Rolled back ${result.length} migration${
            result.length === 1 ? '' : 's'
          }`
        );
        break;
      default:
        break;
    }

    if (result.length > 0) {
      for (const name of result.map((f) => f.name)) {
        console.log(`${name}`);
      }
    }
    process.exitCode = 0;
  } catch (e) {
    console.log(e);
    console.log(`\n\x1b[31mError message\x1b[0m: ${e.message}`);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    process.exit();
  }
};

await init();
