module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: true,
    content: [
      './src/**/*.js',
      './public/**/*.html',
    ],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
