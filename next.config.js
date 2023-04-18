const nextra = require('nextra');
const { i18n } = require('./next-i18next.config');

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
});

module.exports = (_, { defaultConfig }) => ({
  ...defaultConfig,
  ...withNextra({
    unstable_flexsearch: true,
  }),
  distDir: 'build/dist',
  generateBuildId: async () => 'api-homepage',
  i18n,
});