module.exports = {
  distDir: 'build/dist',
  generateBuildId: async () => 'api-homepage',
  plugins: [],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|otf)$/,
      use: 'file-loader',
    });
    return config;
  },
};
