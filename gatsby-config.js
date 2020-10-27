module.exports = {
  pathPrefix: '/igbo_api',
  plugins: [
    'gatsby-plugin-offline',
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /assets\/icons/,
        },
      },
    },
  ],
};
