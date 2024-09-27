const { i18n } = require('./next-i18next.config');

module.exports = {
  distDir: 'dist',
  generateBuildId: async () => 'api-homepage',
  pageExtensions: ['page.tsx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n,
};

// TODO: create a migration that migrates:
// Project.type
// ExampleSuggestion.translations.createdAt
// ExampleSuggestion.translations.updatedAt
// Example.translations.createdAt
// Example.translations.updatedAt
