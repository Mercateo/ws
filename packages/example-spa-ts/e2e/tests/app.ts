describe('example-spa-ts', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('check', () => {
    cy.title().should('equal', 'App');
    cy.contains('Hello _otbe_');
    cy.contains('This string was loaded from a JSON file: world');
  });
});
