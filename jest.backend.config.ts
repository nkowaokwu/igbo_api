// Backend Jest Config
export default {
  displayName: 'igbo_api',
  testMatch: ['**/__tests__/*.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__',
    '<rootDir>/src/__tests__',
    '<rootDir>/src/controllers/__tests__',
  ],
  testTimeout: 20000,
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
