/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: ['_site/**'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'no-console': 1, // Means warning
    'prettier/prettier': 2 // Means error
  },
  env: {
    browser: true
  },
  globals: {
    Locations: true
  }
};
