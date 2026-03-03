import { registerWrapper } from './index.js';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadWrappers() {
  const implementationsDir = join(__dirname, 'implementations');
  const shouldLog = process.env.NODE_ENV !== 'test';

  try {
    const files = await readdir(implementationsDir);

    const wrapperFiles = files.filter(
      (file) => file.endsWith('.js') && !file.startsWith('.')
    );

    const loadPromises = wrapperFiles.map(async (file) => {
      try {
        const filePath = join(implementationsDir, file);
        // Use pathToFileURL to avoid SSR host warnings and ensure valid file URLs
        const module = await import(pathToFileURL(filePath).href);

        const wrapperFunction = Object.values(module).find(
          (exported) =>
            typeof exported === 'function' &&
            exported.name.startsWith('wrap') &&
            exported.name.endsWith('Code')
        );

        const metadata = Object.values(module).find(
          (exported) =>
            typeof exported === 'object' &&
            exported !== null &&
            !Array.isArray(exported) &&
            Array.isArray(exported.supportedLanguages)
        );

        if (wrapperFunction && metadata) {
          registerWrapper(
            metadata.supportedLanguages,
            wrapperFunction,
            metadata
          );
          if (shouldLog) {
            console.log(
              `✓ Loaded wrapper: ${metadata.supportedLanguages.join(', ')} (${file})`
            );
          }
        } else if (shouldLog) {
          console.warn(
            `⚠ Skipping ${file}: Missing wrapper function or metadata`
          );
        }
      } catch (error) {
        if (shouldLog) {
          console.error(
            `✗ Failed to load wrapper from ${file}:`,
            error.message
          );
        }
      }
    });

    await Promise.all(loadPromises);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error loading wrappers:', error);
    }
  }
}
