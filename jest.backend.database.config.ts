import jestBackendConfig from './jest.backend.config';

// Backend + Database Jest Config
export default {
  ...jestBackendConfig,
  testPathIgnorePatterns: [],
  globalSetup: './testSetup.ts',
};
