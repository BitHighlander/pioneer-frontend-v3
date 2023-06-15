module.exports = {
  // other ESLint configurations...
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    // Other ESLint extends...
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // Other rules...

    // Disable specific rules
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'func-names': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-shadow': 'off',
    'react/jsx-no-bind': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    // Allow @ts-ignore comments with descriptions
    '@typescript-eslint/ban-ts-comment': [
      'warn',
      {
        'ts-ignore': 'allow-with-description',
      },
    ],
  },
};
