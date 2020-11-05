describe('Homepage', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('http://localhost:8000');
  });

  it('searches and wait for words using igbo', () => {
    const keyword = 'bia';
    cy.searchDictionary(keyword);
    cy.get('[data-test="word"]');
  });

  it('searches and wait for words using english', () => {
    const keyword = 'run';
    cy.searchDictionary(keyword);
    cy.get('[data-test="word"]');
  });

  describe('About', () => {
    it('loads the about page', () => {
      cy.get('a[href="/about"]').click();
      cy.get('h1').contains('About');
    });
  });

  describe('Pagination', () => {
    it('renders the pagination bar', () => {
      const keyword = 'more';
      cy.searchDictionary(keyword);
      cy.get('[data-test="word"]');
      cy.get('[data-test="pagination"]');
    });

    it('doesn\'t render the pagination bar', () => {
      const keyword = '';
      cy.route({
        method: 'GET',
        url: `/api/v1/words?keyword=${keyword}`,
        response: [],
        status: 200,
      }).as('noPaginationBar');
      cy.searchDictionary(keyword);
      cy.get('[data-test="pagination"]').should('not.exist');
    });
  });
});
