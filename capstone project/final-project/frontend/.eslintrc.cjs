module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  plugins: ['import', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['tests/**', 'vitest.config.js'] },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Input'],
        depth: 3,
        assert: 'either',
      },
    ],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['#components', './assets/components'],
          ['#constants', './assets/constants'],
          ['#js', './assets/js'],
          ['#img', './assets/img'],
          ['#modules', './assets/modules'],
          ['#css', './assets/css'],
          ['#config', './config'],
        ],
        extensions: ['.js', '.jsx', '.css'],
      },
    },
  },
  env: { browser: true, node: true, es2021: true },
  overrides: [
    {
      files: ['**/*.jsx', '**/*.js', '**/*.mjs'],
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    },
    {
      files: ['vitest.config.jsx'],
      rules: { 'import/no-extraneous-dependencies': 'off' },
    },
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
      env: {
        jest: true,
      },
      globals: {
        vi: 'readonly',
      },
    },
  ],
};
