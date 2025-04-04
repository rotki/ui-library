describe('timepickers', () => {
  beforeEach(() => {
    cy.visit('/timepickers');
  });

  it('checks for rendered timepicker', () => {
    cy.contains('h2[data-cy=timepickers]', 'Time Pickers');

    cy.contains('08').should('be.exist');
    cy.contains('20').should('be.exist');
    cy.contains('PM').should('be.exist');
  });

  it('should be able to select time', () => {
    cy.get('.rui-hour-06').click();
    cy.get('.rui-minute-30').click();

    cy.contains('06').should('be.exist');
    cy.contains('30').should('be.exist');
    cy.contains('PM').should('be.exist');
  });
});
