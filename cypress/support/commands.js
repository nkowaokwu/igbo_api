Cypress.Commands.add('searchDictionary', (keyword) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: `/api/v1/words?keyword=${keyword}`,
    response: [
      {
        word: 'word',
        wordClass: 'wordClass',
        definitions: ['first definitions'],
        variations: [],
        examples: [],
      },
      {
        word: 'secondWord',
        wordClass: 'secondWordClass',
        definitions: ['first definitions'],
        variations: ['first variations'],
        examples: [
          {
            igbo: 'igbo text',
            english: 'english text',
            associatedWords: [],
          },
        ],
      },
    ],
    status: 200,
  });
  cy.get('[data-test="search-bar"]').type(keyword);
  cy.contains('Search').click();
});
