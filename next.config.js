const nextra = require('nextra');

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
});

module.exports = withNextra({
  generateBuildId: async () => 'api-homepage',
  pageExtensions: ['page.tsx'],
});
