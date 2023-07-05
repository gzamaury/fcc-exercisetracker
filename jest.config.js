export default {
  testEnvironment: 'node',
  setupFiles: ['./jest-setup.js'],
  setupFilesAfterEnv: ['./jest-after.js'],
  testMatch: ['**/tests/**/*.test.js'],
};
