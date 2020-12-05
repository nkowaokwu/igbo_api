import './commands';

beforeEach(() => {
  cy.server();
  cy.restoreLocalStorage();
  cy.visit('http://localhost:8000');
});

afterEach(() => {
  cy.saveLocalStorage();
});
