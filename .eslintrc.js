module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['tsconfig.json', 'test/*/tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true
  },
  ignorePatterns: [
    '.eslintrc.js',
    'dist'
  ],
  rules: {
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
  }
}
