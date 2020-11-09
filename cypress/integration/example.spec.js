const DETACH_DELAY = 1000;
describe('Example', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('http://localhost:8000');
  });
  describe('Add Example', () => {
    beforeEach(() => {
      const keyword = 'word';
      cy.searchDictionary(keyword);
      cy.get('[data-test="select-actions"]').first().click();
      cy.contains('Create an Example').click();
    });

    it('renders the success result view', () => {
      cy.route({
        method: 'POST',
        url: '/api/v1/exampleSuggestions',
        response: { id: 'success' },
        status: 200,
      }).as('postExampleSuggestion');
      cy.get('[data-test="igbo-input"]').type('igbo');
      cy.get('[data-test="english-input"]').type('english');
      cy.get('button[type="submit"]').contains('Submit').click();
      cy.wait('@postExampleSuggestion');
      cy.get('[data-test="result-success"]');
    });

    it('renders the failure result view', () => {
      cy.route({
        method: 'POST',
        url: '/api/v1/exampleSuggestions',
        response: { id: 'success' },
        status: 400,
      }).as('postExampleSuggestion');
      cy.get('button[type="submit"]').contains('Submit').click();
      cy.wait('@postExampleSuggestion');
      cy.get('[data-test="result-error"]');
    });

    it('picks up word in modal', () => {
      const keyword = 'customWord';
      cy.get('p').contains(keyword);
      cy.get(`[placeholder="Example in Igbo using ${keyword}"]`);
      cy.get(`[placeholder="Example in English using ${keyword}"]`);
    });

    it('goes back from result view', () => {
      cy.route({
        method: 'POST',
        url: '/api/v1/exampleSuggestions',
        response: { id: 'success' },
        status: 400,
      }).as('postExampleSuggestion');
      cy.get('button[type="submit"]').contains('Submit').click();
      cy.wait('@postExampleSuggestion');
      cy.get('[data-test="result-error"]');
      cy.get('button').contains('Back to Form').click();
      cy.get('[data-test="igbo-input"]');
      cy.get('[data-test="english-input"]');
    });

    it('handles a user email', () => {
      const keyword = 'word';
      cy.searchDictionary(keyword);
      cy.wait(DETACH_DELAY); // eslint-disable-line
      cy.get('[data-test="select-actions"]').eq(1).click();
      cy.contains('Suggest an Edit').click();
      cy.get('[data-test="suggestion-modal"]');
      cy.get('[data-test="user-email"]').type('test@example.com');
      cy.contains('Submit').click();
      cy.get('[data-test="suggestion-modal"]');
    });
  });
});
