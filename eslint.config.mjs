// @ts-check
import esPlugin from '@eslint/js'
import tsPlugin from 'typescript-eslint'
import stylisticTsPlugin from '@stylistic/eslint-plugin-ts'
import jestPlugin from 'eslint-plugin-jest'

export default tsPlugin.config([
  {
    files: ['tests/**/*.ts'],
    extends: [
      esPlugin.configs.recommended,
      tsPlugin.configs.recommended,
      jestPlugin.configs['flat/recommended'],
      stylisticTsPlugin.configs['all-flat']
    ],
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      'no-unused-vars': 'off',
      'newline-per-chained-call': 'off',
      'jest/prefer-importing-jest-globals': 'error',
      'jest/no-disabled-tests': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }]
    }
  },
  {
    files: ['lib/**/*.ts'],
    extends: [
      esPlugin.configs.recommended,
      tsPlugin.configs.recommendedTypeCheckedOnly,
      stylisticTsPlugin.configs['all-flat'],
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }]
    }
  }
])