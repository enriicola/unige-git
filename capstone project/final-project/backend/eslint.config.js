import pluginPrettier from 'eslint-plugin-prettier';
import pluginImport from 'eslint-plugin-import';
import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    ignores: ['**/node_modules/**', '**/log/**', '**/coverage/**'],
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: pluginPrettier,
      import: pluginImport,
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],
      'no-param-reassign': ['error', { props: false }],
    },
  },
];
