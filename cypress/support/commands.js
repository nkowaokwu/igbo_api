// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('searchDictionary', (keyword) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: `/api/v1/words?keyword=${keyword}`,
    response: [
      {
        word: 'word',
        wordClass: 'wordClass',
        definitions: ['first definitions'],
        variations: [],
        examples: [],
      },
      {
        word: 'secondWord',
        wordClass: 'secondWordClass',
        definitions: ['first definitions'],
        variations: ['first variations'],
        examples: [
          {
            igbo: 'igbo text',
            english: 'english text',
            associatedWords: [],
          },
        ],
      },
    ],
    status: 200,
  });
  cy.get('[data-test="search-bar"]').type(keyword);
  cy.contains('Search').click();
});
