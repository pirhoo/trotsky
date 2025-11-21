/** @type {import('jest').Config} */
export default {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  // 120s is a lot of time for a test to run but we need to account for the time it takes
  // to start the TestServer provided by @atproto/dev-env
  testTimeout: 120e3,
  setupFiles: ['<rootDir>/jest.setup.ts'],
  maxWorkers: 1,
}