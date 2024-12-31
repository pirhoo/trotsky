/** @type {import('jest').Config} */
export default {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
}