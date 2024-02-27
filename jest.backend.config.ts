// Backend Jest Config
export default {
  displayName: 'igbo_api',
  testMatch: ['**/__tests__/*.ts'],
  testTimeout: 20000,
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globalSetup: './testSetup.ts',
};
