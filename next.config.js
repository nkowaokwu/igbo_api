/* eslint-disable */
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  distDir: 'build',
  generateBuildId: async () => 'api-homepage',
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
});
