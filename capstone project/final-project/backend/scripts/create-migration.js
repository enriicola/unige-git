import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const defaultMigrationsDir = path.join(rootDir, 'migrations');

function pad(num, size = 2) {
  return String(num).padStart(size, '0');
}

function timestamp() {
  const now = new Date();
  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

function slugify(str) {
  return String(str || 'migration')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const nameArg = process.argv[2];
if (!nameArg) {
  console.error('Usage: node scripts/create-migration.js <title>');
  process.exit(1);
}

const targetDir =
  process.env.MIGRATIONS_DIR && process.env.MIGRATIONS_DIR.trim() !== ''
    ? path.resolve(process.env.MIGRATIONS_DIR)
    : defaultMigrationsDir;

const fileName = `${timestamp()}-${slugify(nameArg)}.js`;
const target = path.join(targetDir, fileName);

const template = `import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    // TODO: add migration steps
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function down({ context: queryInterface }) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    // TODO: add revert steps
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
`;

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true, mode: 0o775 });
}

fs.writeFileSync(target, template, { encoding: 'utf-8', mode: 0o666 });
try {
  fs.chmodSync(target, 0o666);
} catch {
  // ignore chmod errors; file was created anyway
}
console.log(`Created migration: ${target}`);
