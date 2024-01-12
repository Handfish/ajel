module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'ajel'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:ajel/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // 'ajel/ajel-const-tuples': [
    //   'error',
    //   {
    //     ajelAlias: "blimpy",
    //   },
    // ],
    // 'ajel/ajel-require-error-handling': [
    //   'error',
    //   {
    //     ajelAlias: 'blimpy',
    //   },
    // ],
    // 'ajel/ajel-require-tuple-declaration': [
    //   'error',
    //   {
    //     ajelAlias: 'blimpy',
    //   },
    // ],
    // 'ajel/ajel-disable-try-catch': [
    //   'error',
    //   {
    //     ajelAlias: 'blimpy',
    //   },
    // ],
  },
  overrides: [
    {
      files: 'scripts/**/*.ts',
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
};
