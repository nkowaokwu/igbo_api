const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  distDir: 'build',
  generateBuildId: async () => 'api-homepage',
});
