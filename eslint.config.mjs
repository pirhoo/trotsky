// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylisticTs from '@stylistic/eslint-plugin-ts'

export default tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['.dist'],
  },
  {
    files: ['lib/**/*.ts'],
    extends: [
      tseslint.configs.recommendedTypeCheckedOnly,
      stylisticTs.configs['all-flat']
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    }
  }
])