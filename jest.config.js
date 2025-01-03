/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testTimeout: 15000,
  setupFiles: ['<rootDir>/jest.setup.ts'],
}