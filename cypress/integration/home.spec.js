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

  describe('Add Word', () => {
    it('renders the add new word modal', () => {
      cy.get('[data-test="add-button"]').click();
      cy.get('[data-test="suggestion-modal"]');
    });

    it('renders the success result view', () => {
      cy.route({
        method: 'POST',
        url: '/api/v1/wordSuggestions',
        response: { id: 'success' },
        status: 200,
      }).as('postWordSuggestion');
      cy.get('[data-test="add-button"]').click();
      cy.get('[data-test="new-word-input"]').type('new word');
      cy.get('[data-test="word-class-input"]').type('new word class');
      cy.get('[aria-label="Add Definition"]').click();
      cy.get('[data-test="definitions-0-input"]').type('first definition');
      cy.get('[aria-label="Add Variation"]').click();
      cy.get('[data-test="variations-0-input"]').type('first variation');
      cy.get('button[type="submit"]').contains('Submit').click();
      cy.wait('@postWordSuggestion');
      cy.get('[data-test="result-success"]');
    });

    it('renders the failure result view', () => {
      cy.route({
        method: 'POST',
        url: '/api/v1/wordSuggestions',
        response: { id: 'success' },
        status: 400,
      }).as('postWordSuggestion');
      cy.get('[data-test="add-button"]').click();
      cy.get('[data-test="new-word-input"]').type('new word');
      cy.get('[data-test="word-class-input"]').type('new word class');
      cy.get('[data-test="definitions-0-input"]').type('first definition');
      cy.get('button[type="submit"]').contains('Submit').click();
      cy.wait('@postWordSuggestion');
      cy.get('[data-test="result-error"]');
    });

    it('clears the data once the modal is closed', () => {
      cy.get('[data-test="add-button"]').click();
      cy.get('[data-test="new-word-input"]').type('new word');
      cy.get('[data-test="word-class-input"]').type('new word class');
      cy.get('[aria-label="Add Definition"]').click();
      cy.get('[data-test="definitions-0-input"]').type('first definition');
      cy.get('[aria-label="Add Variation"]').click();
      cy.get('[data-test="variations-0-input"]').type('first variation');
      cy.get('button').contains('Cancel').click();
      cy.get('[data-test="add-button"]').click();
      cy.get('[data-test="new-word-input"]').should('not.have.value');
      cy.get('[data-test="word-class-input"]').should('not.have.value');
      cy.get('[data-test="definitions-0-input"]').should('not.have.value');
      cy.contains('No variations');
    });

    it('goes back from result view', () => {
      cy.route({
        method: 'POST',
        url: '/api/v1/wordSuggestions',
        response: { id: 'success' },
        status: 400,
      }).as('postWordSuggestion');
      cy.get('[data-test="add-button"]').click();
      cy.get('[data-test="new-word-input"]').type('new word');
      cy.get('[data-test="word-class-input"]').type('new word class');
      cy.get('[data-test="definitions-0-input"]').type('first definition');
      cy.get('button[type="submit"]').contains('Submit').click();
      cy.wait('@postWordSuggestion');
      cy.get('[data-test="result-error"]');
      cy.get('button').contains('Back to Form').click();
      cy.get('[data-test="new-word-input"]');
    });

    it('adds and deletes definitions', () => {
      cy.get('[data-test="add-button"]').click();
      cy.get('[data-test="definitions-0-input"]');
      cy.get('[aria-label="Add Definition"]').click();
      cy.get('[data-test="definitions-1-input"]');
      cy.get('[aria-label="Delete Definition"]').first().click();
      cy.get('[data-test="definitions-1-input"]').should('not.exist');
    });

    it('adds and deletes variations', () => {
      cy.get('[data-test="add-button"]').click();
      cy.get('[aria-label="Add Variation"]').click();
      cy.get('[data-test="variations-0-input"]');
      cy.get('[aria-label="Add Variation"]').click();
      cy.get('[data-test="variations-1-input"]');
      cy.get('[aria-label="Add Variation"]').click();
      cy.get('[data-test="variations-2-input"]');
      cy.get('[aria-label="Delete Variation"]').first().click();
      cy.get('[data-test="variations-2-input"]').should('not.exist');
    });
  });

  describe('No word', () => {
    it('renders no word component', () => {
      cy.fixture('constants.json').then(({ NOT_A_WORD }) => {
        cy.searchDictionary(NOT_A_WORD);
        cy.get('[data-test="define-word-button"]');
      });
    });

    it('opens the add word form', () => {
      cy.fixture('constants.json').then(({ NOT_A_WORD }) => {
        cy.searchDictionary(NOT_A_WORD);
        cy.get('[data-test="define-word-button"]').click();
        cy.get(`input[value="${NOT_A_WORD}"]`);
      });
    });
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
