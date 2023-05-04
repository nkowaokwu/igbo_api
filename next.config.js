const { i18n } = require('./next-i18next.config');

module.exports = (_, { defaultConfig }) => ({
  ...defaultConfig,
  distDir: 'build/dist',
  generateBuildId: async () => 'api-homepage',
  i18n,
});
