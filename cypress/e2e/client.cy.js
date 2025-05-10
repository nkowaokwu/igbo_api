import { v4 as uuid } from 'uuid';

describe('Igbo API Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Outside links', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('navigate to Nkọwa okwu website', () => {
      cy.findByTestId('nkowaokwu-link').click({ force: true });
      cy.url().should('equal', 'https://nkowaokwu.com/home');
      cy.contains('Internal Server Error').should('not.exist');
    });
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
      cy.get('li').contains('About').click({ force: true });
      cy.findByText('Contact');
      cy.contains('kedu@nkowaokwu.com');
    });

    it('render the Privacy page', () => {
      cy.findByText('Privacy Policy').click();
      cy.get('h1').contains('Privacy Policy').should('exist');
    });

    it('render the Terms or Service page', () => {
      cy.findByText('Terms of Service').click();
      cy.findByText('Terms and Conditions').should('exist');
    });

    describe('Try it Out', () => {
      it('enter a word and select flag', () => {
        cy.visit('/');
        cy.findByTestId('try-it-out-input').clear({ force: true }).type('biko', { force: true });
        cy.findByTestId('dialects-flag').click();
        cy.get('button').contains('Submit').click();
        cy.get('code')
          .contains('http://localhost:8080/api/v1/words?keyword=biko&dialects=true')
          .should('exist');
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

    describe('Log in to Account', () => {
      beforeEach(() => {
        cy.visit('/login');
      });

      it('render the Login page', () => {
        cy.findByText('Log in.');
      });

      it('fill out the sign up form and submit for developer account', () => {
        const email = `${uuid()}@testing.com`;
        cy.findByTestId('login-email-input').clear().type(email);
        cy.findByTestId('login-password-input').clear().type('password');
        cy.findByText('Login').click();
      });
    });
  });

  describe('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });

    it('render the About page', () => {
      cy.findByTestId('drop-down-button').click();
      cy.get('button').contains('About').click({ force: true });
      cy.findByText('Contact');
      cy.contains('kedu@nkowaokwu.com');
    });
    it('render the Sign up page', () => {
      cy.findByTestId('drop-down-button').click();
      cy.get('button').contains('Sign Up').click({ force: true });
      cy.findByText('Sign up.');
    });

    it('navigate to Nkọwa okwu', () => {
      cy.visit('/');
      cy.scrollTo(0, -300);
      cy.findByTestId('nkowaokwu-link').click({ force: true });
    });
  });
});
