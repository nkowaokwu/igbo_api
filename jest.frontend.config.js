// Frontend Jest Config
module.exports = {
  displayName: 'igbo_api',
  testMatch: ['./**/__tests__/**/*.test.tsx'],
  testTimeout: 20000,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['src/__tests__/*.tsx'],
  moduleFileExtensions: ['tsx', 'ts', 'js', 'json', 'html'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+\\.(svg|gif|png|less|css)$': '<rootDir>/src/__data__/assetStub.ts',
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./src/__tests__/shared/script.ts'],
};
