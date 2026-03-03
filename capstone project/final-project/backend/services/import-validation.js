const IMPORTS_END_MARKER = '// __CODYMATCH_IMPORTS_END__';
const INCLUDE_PATTERN = /^\s*#include\b/;

export function validateImportsBlock(code, language) {
  if (typeof code !== 'string') return null;
  if (typeof language !== 'string' || !language) return null;

  const normalizedLanguage = language.toLowerCase();
  if (normalizedLanguage !== 'cpp' && normalizedLanguage !== 'c') {
    return null;
  }

  const markerIndex = code.indexOf(IMPORTS_END_MARKER);
  if (markerIndex === -1) return null;

  const importBlock = code.slice(0, markerIndex);
  const invalidLines = importBlock.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return !INCLUDE_PATTERN.test(line);
  });

  if (invalidLines.length === 0) return null;

  return 'Only #include lines are allowed in the imports section.';
}

export { IMPORTS_END_MARKER };
