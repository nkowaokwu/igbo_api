describe('Igbo API Homepage', () => {
  before(() => {
    cy.visit('http://localhost:8080');
  });

  it('executes JS in browser and renders API homepage', () => {
    cy.get('h1').contains('The First African Language API');
    cy.contains('An unexpected error has occurred.').should('not.exist');
  });
});
