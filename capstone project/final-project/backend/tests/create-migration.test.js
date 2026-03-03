import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { describe, it, expect } from 'vitest';

const exec = promisify(execFile);
const scriptPath = path.resolve('scripts/create-migration.js');

describe('create-migration script', () => {
  it('creates a writable migration file with timestamped name', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codymatch-mig-'));
    const title = 'add-test-table';

    await exec('node', [scriptPath, title], {
      env: { ...process.env, MIGRATIONS_DIR: tmpDir },
      cwd: path.resolve('.'),
    });

    const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.js'));
    expect(files.length).toBe(1);
    const filePath = path.join(tmpDir, files[0]);
    const stats = fs.statSync(filePath);

    expect(files[0]).toMatch(/^\d{14}-add-test-table\.js$/);
    // Writable by owner/group/others (umask may trim some bits)
    expect(stats.mode & 0o200).toBe(0o200);

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('export async function up');
    expect(content).toContain('export async function down');
  });
});
