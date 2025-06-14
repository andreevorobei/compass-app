module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals'
  ],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
  },
  // Явно указываем парсер для избежания ошибок
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
} 