import js from "@eslint/js";
import nextPlugin from '@next/eslint-plugin-next';
import gitignore from "eslint-config-flat-gitignore";
import ts from "typescript-eslint";
import tsParser from '@typescript-eslint/parser';
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import sortPlugin from "eslint-plugin-simple-import-sort";
import globals from 'globals';

export default [
  gitignore(),
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "simple-import-sort": sortPlugin,
    },
    rules: {
      // React & JSX rules
      indent: ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: { var: 1, let: 1, const: 1 },
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        MemberExpression: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
      }],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "react/no-array-index-key": "error",
      "no-nested-ternary": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-parens": ["error", "always"],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^next'],
            ['^@?\\w'],
            ['^@/'],
            ['^#'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css)$'],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      'comma-spacing': ['error', { before: false, after: true }],

      // Import rules
      "import/order": "off", // handled by simple-import-sort
      "import/no-unresolved": "off", // handled by TS
    },
  },
  

];
