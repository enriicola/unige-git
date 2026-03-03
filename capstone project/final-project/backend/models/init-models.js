import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as migrator from '#root/services/migrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};
export function initRelations() {
  Object.values(models).forEach((model) => {
    if (typeof model.initializeRelations === 'function')
      model.initializeRelations(models);
  });
  return models;
}

export async function seedModels() {
  // Seed in dependency-safe order first, then the remaining models
  const orderedNames = [
    'User', // users referenced by participants
    'Challenge', // challenges referenced by match settings/participants
    'MatchSetting', // needed before challenge_match_setting
    'ChallengeMatchSetting',
    'ChallengeParticipant',
  ];

  const seen = new Set();
  const runSeed = async (model) => {
    if (!model || seen.has(model.name)) return;
    seen.add(model.name);
    console.log(`Checking seed for model: ${model.name}`);
    if (typeof model.seed === 'function') {
      console.log(`Seeding ${model.name}...`);
      await model.seed();
    }
  };

  for (const name of orderedNames) await runSeed(models[name]);
  for (const model of Object.values(models)) await runSeed(model);
}
export default {
  init: async function init() {
    for (const file of fs.readdirSync(__dirname)) {
      if (!file.endsWith('.js') || file === 'init-models.js') continue;
      const modulePath = path.join(__dirname, file);
      const { default: Model } = await import(modulePath);
      models[Model.name] = Model;
    }
    const registeredModels = initRelations();
    const isTestEnv =
      process.env.NODE_ENV === 'test' || process.env.ENVIRONMENT === 'test';
    const shouldRunMigrations =
      !isTestEnv || process.env.RUN_MIGRATIONS_ON_BOOT === 'true';

    if (shouldRunMigrations) await migrator.up();
    if (!isTestEnv) await seedModels(registeredModels);
    return registeredModels;
  },
};
