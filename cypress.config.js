// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    video: false,
    chromeWebSecurity: false,
    execTimeout: 5000,
    retries: {
      runMode: 2,
    },
    pageLoadTimeout: 30000,
    taskTimeout: 30000,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
