import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

const eslintConfig = [
  js.configs.recommended,

  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '*.config.{js,ts,mjs}',
      '.eslintcache',
      'src/app/_/**',
      'src/lib/**',
      '**/*.d.ts',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        ...globals.es2022,
        ...globals.es2023,
        ...globals.es2024,
        ...globals.vitest,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      boundaries: boundaries,
    },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true } },
      react: { version: 'detect' },
      'boundaries/include': ['src/**/*'],
      'boundaries/ignore': ['src/middleware.{js,ts}'],
      'boundaries/elements': [
        // Test files must be recognized as separate layer to allow broad imports
        { type: 'test', pattern: '**/*.test.*' },
        { type: 'test', pattern: '**/tests/**/*' },
        { type: 'app', pattern: 'app' },
        { type: 'pages', pattern: 'pages-slice/*', capture: ['page'] },
        { type: 'widgets', pattern: 'widgets/*', capture: ['widget'] },
        { type: 'features', pattern: 'features/*', capture: ['feature'] },
        { type: 'entities', pattern: 'entities/*', capture: ['entity'] },
        { type: 'shared', pattern: 'shared/*', capture: ['segment'] },
      ],
    },
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'error',
      'no-debugger': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'warn',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',

      'boundaries/no-unknown-files': 'error',
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          rules: [
            { target: [['shared', { segment: 'lib' }]], allow: '*/index.ts' },
            { target: [['shared', { segment: 'lib' }]], allow: '*.(ts|tsx)' },
            { target: [['shared', { segment: 'constants' }]], allow: 'index.ts' },
            { target: [['shared', { segment: 'types' }]], allow: 'index.ts' },
            { target: [['shared', { segment: 'config' }]], allow: '*.(ts|tsx)' },
            { target: [['shared', { segment: '(ui|api)' }]], allow: '**' },
            // Allow direct access to i18n and request types modules where needed for tests / coverage
            { target: ['features', 'widgets'], allow: 'model/i18n.ts' },
            { target: ['pages'], allow: 'i18n.ts' },
            { target: ['entities'], allow: 'model/request.types.ts' },
            {
              target: ['app', 'pages', 'widgets', 'features', 'entities'],
              allow: 'index.(ts|tsx)',
            },
            {
              target: ['app', 'pages', 'widgets', 'features', 'entities'],
              allow: 'pub/*.(ts|tsx)',
            },
            { target: ['test'], allow: '**' },
          ],
        },
      ],
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          message: '${file.type} не может импортировать (${dependency.type})',
          rules: [
            {
              from: ['test'],
              allow: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
              message: 'Тесты могут импортировать из любых слоев',
            },
            {
              from: ['shared'],
              disallow: ['app', 'pages', 'widgets', 'features', 'entities'],
              message: 'Shared модуль не может импортировать верхние слои (${dependency.type})',
            },
            {
              from: ['entities'],
              message: 'Entity не может импортировать верхние слои (${dependency.type})',
              disallow: ['app', 'pages', 'widgets', 'features'],
            },
            {
              from: ['entities'],
              message: 'Entity не может импортировать другую entity',
              disallow: [['entities', { entity: '!${entity}' }]],
            },
            {
              from: ['features'],
              message: 'Feature не может импортировать верхние слои (${dependency.type})',
              disallow: ['app', 'pages', 'widgets'],
            },
            {
              from: ['features'],
              message: 'Feature не может импортировать другую feature',
              disallow: [['features', { feature: '!${feature}' }]],
            },
            {
              from: ['widgets'],
              message: 'Widget не может импортировать верхние слои (${dependency.type})',
              disallow: ['app', 'pages'],
            },
            {
              from: ['widgets'],
              message: 'Widget не может импортировать другой widget',
              disallow: [['widgets', { widget: '!${widget}' }]],
            },
            {
              from: ['pages'],
              message: 'Page не может импортировать верхние слои (${dependency.type})',
              disallow: ['app'],
            },
            {
              from: ['pages'],
              message: 'Page не может импортировать другую page',
              disallow: [['pages', { page: '!${page}' }]],
            },
          ],
        },
      ],
    },
  },

  prettierConfig,

  // Override: relax architectural boundaries inside test specs to allow white-box coverage
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    rules: {
      'boundaries/no-unknown-files': 'off',
      'boundaries/entry-point': 'off',
      'boundaries/element-types': 'off',
    },
  },
];

export default eslintConfig;
