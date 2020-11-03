Cypress.Commands.add('searchDictionary', (keyword) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/api/v1/words**',
    headers: {
      'content-range': 12,
    },
    response: keyword !== '' ? [
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
    ] : [],
    status: 200,
  });
  if (keyword !== '') {
    cy.get('[data-test="search-bar"]').type(keyword);
  }
  cy.get('[data-test="search-button"]').click();
});
