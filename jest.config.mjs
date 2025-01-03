/** @type {import('jest').Config} */
export default {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testTimeout: 15000,
  setupFiles: ['<rootDir>/jest.setup.ts'],
}