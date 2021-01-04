/* eslint-disable */
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  distDir: 'build/dist',
  generateBuildId: async () => 'api-homepage',
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
});
