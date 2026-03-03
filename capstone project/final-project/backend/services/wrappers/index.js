import { validateWrapper } from './base-wrapper.js';
import { loadWrappers } from './loader.js';

const wrappers = new Map();
const wrapperMetadata = new Map();

export function registerWrapper(languages, wrapperFunction, metadata = {}) {
  validateWrapper(wrapperFunction);

  const langArray = Array.isArray(languages) ? languages : [languages];

  langArray.forEach((lang) => {
    const normalizedLang = lang.toLowerCase();
    wrappers.set(normalizedLang, wrapperFunction);

    if (Object.keys(metadata).length > 0) {
      wrapperMetadata.set(normalizedLang, {
        ...metadata,
        languages: langArray,
      });
    }
  });
}

export function wrapCode(language, userCode) {
  const lang = language.toLowerCase();
  const wrapper = wrappers.get(lang);

  if (!wrapper) {
    const available = Array.from(wrappers.keys()).join(', ');
    throw new Error(
      `No wrapper registered for language: ${language}. Available languages: ${available || 'none'}`
    );
  }

  return wrapper(userCode);
}

export function hasWrapper(language) {
  return wrappers.has(language.toLowerCase());
}

export function getRegisteredLanguages() {
  return Array.from(new Set(wrappers.keys()));
}

export function getWrapperMetadata(language) {
  return wrapperMetadata.get(language.toLowerCase()) || null;
}

export function getAllWrapperMetadata() {
  const result = {};
  wrapperMetadata.forEach((meta, lang) => {
    result[lang] = meta;
  });
  return result;
}

loadWrappers().catch((error) => {
  console.error('Failed to load wrappers:', error);
});
