/* eslint-disable */
const withLess = require('@zeit/next-less');

module.exports = withLess({
  distDir: 'build/dist',
  generateBuildId: async () => 'api-homepage',
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
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
