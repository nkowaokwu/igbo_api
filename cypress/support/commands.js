import wordsResponse from './constants';

Cypress.Commands.add('searchDictionary', (keyword) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/api/v1/words**',
    headers: {
      'content-range': 12,
    },
    response: keyword === 'not a word' ? [] : keyword !== '' ? wordsResponse : [],
    status: 200,
  });
  if (keyword !== '') {
    cy.get('[data-test="search-bar"]').type(keyword);
  }
  cy.get('[data-test="search-button"]').click();
});
