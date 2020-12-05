import { reduce } from 'lodash';

describe('Example', () => {
  before(() => {
    cy.server();
    cy.visit('http://localhost:8000', {
      onBeforeLoad: () => {
        localStorage.setItem('nkowaokwu_welcome_wizard_completed', 'true');
        localStorage.setItem('nkowaokwu_tutorial_guide_completed', 'true');
      },
    });
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

    it('constructs the correct object shape to send to the server', () => {
      const igbo = 'igbo';
      const english = 'english';
      const email = 'test@example.com';
      cy.route({
        method: 'POST',
        url: '/api/v1/exampleSuggestions',
        response: { id: 'success' },
        status: 200,
      }).as('postExampleSuggestion');
      cy.get('[data-test="igbo-input"]').type(igbo);
      cy.get('[data-test="english-input"]').type(english);
      cy.get('[data-test="email-input').type(email);
      cy.get('form[data-test="example-form"]').then((res) => {
        const formData = reduce(res.serializeArray(), (builtFormData, { name, value }) => (
          { ...builtFormData, [name]: value }
        ), {});
        expect(formData.igbo).to.equal(igbo);
        expect(formData.english).to.equal(english);
        expect(formData.email).to.equal(email);
      });
    });
  });
});
