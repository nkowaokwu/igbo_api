import { v4 as uuid } from 'uuid';

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

    describe('Try it Out', () => {
      it('enter a word and select flag', () => {
        cy.visit('/');
        cy.findByTestId('try-it-out-input').clear().type('biko');
        cy.findByTestId('dialects-flag').click();
        cy.get('button').contains('Submit').click();
        cy.get('input[value="http://localhost:8080/api/v1/words?keyword=biko&dialects=true"]');
      });
    });

    describe('Register Account', () => {
      beforeEach(() => {
        cy.visit('/signup');
      });

      it('render the Sign Up page', () => {
        cy.findByText('Sign up.');
      });

      it('fill out the sign up form and submit for developer account', () => {
        const email = `${uuid()}@testing.com`;
        cy.intercept('POST', '**developers').as('postDeveloper');
        cy.findByTestId('signup-name-input').clear().type('Developer');
        cy.findByTestId('signup-email-input').clear().type(email);
        cy.findByTestId('signup-password-input').clear().type('password');
        cy.findByText('Create account').click();
        cy.wait('@postDeveloper').then((res) => {
          expect(res.response.statusCode).to.equal(200);
          cy.findByText('Success! Check your email');
        });
      });

      it('fill out the sign up form and submit for developer account and get an error', () => {
        const email = `${uuid()}@testing.com`;
        cy.intercept('POST', '**developers').as('postDeveloper');
        cy.findByTestId('signup-name-input').clear().type('Developer');
        cy.findByTestId('signup-email-input').clear().type(email);
        cy.findByTestId('signup-password-input').clear().type('password');
        cy.findByText('Create account').click();
        cy.wait('@postDeveloper');
        cy.reload();
        cy.findByTestId('signup-name-input').clear().type('Developer');
        cy.findByTestId('signup-email-input').clear().type(email);
        cy.findByTestId('signup-password-input').clear().type('password');
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
      cy.get('button').contains('About').click();
      cy.findByText('Contact');
      cy.contains('Email:');
    });
    it('render the Sign up page', () => {
      cy.findByAltText('down arrow as menu icon').click();
      cy.get('button').contains('Get an API Key').click();
      cy.findByText('Sign up.');
    });

    it('navigate to Nkọwa okwu', () => {
      cy.visit('/');
      cy.get('.demo-inputs-container').contains('Nkọwa okwu').click();
    });
  });
});
