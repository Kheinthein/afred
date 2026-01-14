module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-floating-promises': 'off', // Nécessite project dans parserOptions
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'max-lines': [
      'warn',
      { max: 500, skipBlankLines: true, skipComments: true },
    ],
    complexity: ['warn', 10],
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '.next',
    'jest.config.js',
    'next.config.js',
    'tailwind.config.ts',
    'postcss.config.js',
  ],
  overrides: [
    {
      files: ['tests/e2e/**/*.ts', 'tests/e2e/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
