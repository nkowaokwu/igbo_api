const { i18n } = require('./next-i18next.config');

module.exports = {
  distDir: 'dist',
  generateBuildId: async () => 'api-homepage',
  pageExtensions: ['page.tsx'],
  i18n,
};
