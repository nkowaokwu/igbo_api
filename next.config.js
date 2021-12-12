module.exports = (_, { defaultConfig }) => ({
  ...defaultConfig,
  distDir: 'build/dist',
  generateBuildId: async () => 'api-homepage',
});
