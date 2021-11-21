module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
  }
}
