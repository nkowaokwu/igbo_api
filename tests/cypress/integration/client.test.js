describe('Igbo API Homepage', () => {
  before(() => {
    cy.visit('/');
  });

  describe('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('execute JS in browser and renders API homepage', () => {
      cy.get('h1').contains('The First African Language API');
      cy.contains('An unexpected error has occurred.').should('not.exist');
    });

    it('render the About page', () => {
      cy.get('li').contains('About').click();
      cy.findByText('Contact');
      cy.contains('Email:');
    });

    describe('Register Account', () => {
      it('render the Sign Up page', () => {
        cy.visit('/signup');
        cy.findByText('Sign up.');
      });

      it('fill out the sign up form and submit for developer account', () => {
        cy.visit('/signup');
        cy.intercept('POST', '**developers').as('postDeveloper');
        cy.findByTestId('signup-name-input').clear().type('Developer');
        cy.findByTestId('signup-email-input').clear().type('developer@test.com');
        cy.findByTestId('signup-password-input').clear().type('password');
        cy.findByTestId('signup-host-input').clear().type('test.com');
        cy.findByText('Create account').click();
        cy.wait('@postDeveloper').then((res) => {
          expect(res.response.statusCode).to.equal(200);
          cy.findByText('Success! Check your email');
        });
      });

      it('fill out the sign up form and submit for developer account and get an error', () => {
        cy.visit('/signup');
        cy.intercept('POST', '**developers').as('postDeveloper');
        cy.findByTestId('signup-name-input').clear().type('Developer');
        cy.findByTestId('signup-email-input').clear().type('developer@example.com');
        cy.findByTestId('signup-password-input').clear().type('password');
        cy.findByTestId('signup-host-input').clear().type('test.com');
        cy.findByText('Create account').click();
        cy.wait('@postDeveloper').then((res) => {
          expect(res.response.statusCode).to.equal(400);
          cy.findByText('Create account').should('not.exist');
          cy.findByText('Success! Check your email').should('not.exist');
        });
      });
    });
  });

  describe('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });

    it('render the About page', () => {
      cy.findByAltText('down arrow as menu icon').click();
      cy.get('a').contains('About').click();
      cy.findByText('Contact');
      cy.contains('Email:');
    });
    it('render the Sign up page', () => {
      cy.findByAltText('down arrow as menu icon').click();
      cy.get('a').contains('Register API Key').click();
    });
  });
});
