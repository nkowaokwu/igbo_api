describe('Homepage', () => {
  before(() => {
    cy.wait(5000);
  })
  beforeEach(() => {
    cy.visit('http://localhost:8000');
  });

  it('searches and wait for words using igbo', () => {
    const keyword = 'bia';
    cy.searchDictionary(keyword);
    cy.wait('@getWord').then(({ response }) => {
      const { body: data } = response;
      expect(data).to.have.lengthOf.at.least(3);
    });
  });

  it('searches and wait for words using english', () => {
    const keyword = 'run';
    cy.searchDictionary(keyword);
    cy.wait('@getWord').then(({ response }) => {
      const { body: data } = response;
      expect(data).to.have.lengthOf.at.least(3);
    });
  });
});
