describe('Igbo API Homepage', () => {
  before(() => {
    cy.visit('/');
    cy.viewport('macbook-16');
  });

  it('execute JS in browser and renders API homepage', () => {
    cy.get('h1').contains('The First African Language API');
    cy.contains('An unexpected error has occurred.').should('not.exist');
  });

  it('render the About page', () => {
    cy.findByAltText('down arrow as menu icon').click();
    cy.get('a').contains('About').click();
    cy.findByText('Contact');
    cy.contains('Email:');
  });

  describe('Register Account', () => {
    before(() => {
      cy.visit('/signup');
    });

    // TODO: Unskip this once the option is in production
    it.skip('render the Sign up page', () => {
      cy.visit('/');
      cy.findByAltText('down arrow as menu icon').click();
      cy.get('a').contains('Register API Key').click();
      cy.findByText('Sign up.');
    });

    it('fill out the sign up form and submit for developer account', () => {
      cy.intercept({
        method: 'POST',
        url: '**developers',
      }).as('postDeveloper');
      cy.findByTestId('signup-name-input').clear().type('Developer');
      cy.findByTestId('signup-email-input').clear().type('developer@example.com');
      cy.findByTestId('signup-password-input').clear().type('password');
      cy.findByTestId('signup-host-input').clear().type('test.com');
      cy.findByText('Create account').click();
      cy.wait('@postDeveloper').then((res) => {
        expect(res.response.statusCode).to.equal(200);
        cy.findByText('Success! Check your email');
      });
    });
  });
});
