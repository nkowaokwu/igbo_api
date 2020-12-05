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

const LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
