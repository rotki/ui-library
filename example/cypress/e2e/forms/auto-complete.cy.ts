describe('forms/TextField', () => {
  beforeEach(() => {
    cy.visit('/auto-completes');
  });

  it('checks for auto-complete and interacts with it', () => {
    cy.contains('h2[data-cy=auto-complete]', 'Auto Complete');

    cy.get('[data-cy=auto-complete-0]').first().as('defaultField');
    cy.get('[data-cy=auto-complete-6]').first().as('outlinedField');
    cy.get('[data-cy=auto-complete-12]').first().as('filledField');
  });
});
