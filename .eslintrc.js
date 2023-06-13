module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['**/functions/*.js'],
  // Prettier plugin should be the last to always override preceding plugins
  extends: ['next', 'airbnb', 'plugin:cypress/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['eslint-plugin-jsx-a11y', 'cypress'],
  rules: {
    'function-call-argument-newline': ['off'],
    'function-paren-newline': ['off'],
    'import/prefer-default-export': ['off'],
    'import/extensions': ['warn'],
    'newline-per-chained-call': ['off'],
    'no-console': ['off'],
    'no-nested-ternary': ['off'],
    'no-promise-executor-return': ['off'],
    'no-underscore-dangle': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/function-component-definition': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'react/no-danger': ['off'],
    '@next/next/no-html-link-for-pages': ['off'],
    '@next/next/no-img-element': ['off'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'next',
        'airbnb',
        'airbnb-typescript',
        'plugin:cypress/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint', 'eslint-plugin-jsx-a11y', 'cypress'],
      rules: {
        'import/prefer-default-export': ['off'],
        'import/extensions': ['warn'],
        'max-len': ['error', { code: 120 }],
        'no-nested-ternary': ['off'],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-empty-function': ['warn'],
        'prefer-const': 'error',
      },
    },
  ],
};
