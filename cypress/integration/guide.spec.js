describe('Guide', () => {
  it('step through the onboarding flow, then close, and then finish tutorial', () => {
    cy.server();
    cy.visit('http://localhost:8000', {
      onBeforeLoad: () => {
        localStorage.setItem('nkowaokwu_welcome_wizard_completed', 'false');
        localStorage.setItem('nkowaokwu_tutorial_guide_completed', 'false');
      },
    });
    cy.contains('Welcome to Nkowa okwu!').should('be.visible');
    cy.get('.slick-next').click();
    cy.contains('We got you covered').scrollIntoView();
    cy.get('.slick-next').click();
    cy.contains('We are the culture').scrollIntoView();
    cy.get('.slick-next').click();
    cy.contains('Want to help even more?').scrollIntoView();
    cy.get('.slick-next').click();
    cy.get('[data-test="modal-exit-button"]').click();
    cy.contains('Start Searching Words');
    cy.contains('Got it').click();
    cy.contains('Start Searching Words').should('not.exist');
  });

  it('complete the search page tutorial', () => {
    cy.server();
    cy.visit('http://localhost:8000', {
      onBeforeLoad: () => {
        localStorage.setItem('nkowaokwu_welcome_wizard_completed', 'true');
        localStorage.setItem('nkowaokwu_tutorial_guide_completed', 'false');
      },
    });
    cy.get('input').clear().type('bia');
    cy.get('[data-test="search-button"]').click();
    cy.contains('Word Results');
    cy.scrollTo('top').then(() => {
      cy.get('.shepherd-button-primary').contains('Next').click();
      cy.contains('You can contribute');
    });
    cy.scrollTo('top').then(() => {
      cy.get('.shepherd-button-primary').eq(1).click();
      cy.contains('See More Information');
    });
    cy.scrollTo('top').then(() => {
      cy.get('.shepherd-button-primary').eq(2).click();
      cy.contains('Adding Words');
    });
    cy.scrollTo('top').then(() => {
      cy.get('.shepherd-button-primary').contains('Got it').click();
      cy.contains('Adding Words').should('not.exist');
    });
  });
});
