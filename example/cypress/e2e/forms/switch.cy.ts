describe('forms/Switch', () => {
  beforeEach(() => {
    cy.visit('/switches');
  });

  it('checks for switches', () => {
    cy.contains('h2[data-cy=switches]', 'Switches');

    cy.get('input[type="checkbox"]').first().as('firstSwitch');
    cy.get('input[type="checkbox"]').eq(1).as('secondSwitch');
    cy.get('input[type="checkbox"][disabled]').first().as('disabledSwitch');

    cy.get('@firstSwitch').should('not.be.checked');
    cy.get('@firstSwitch').click();
    cy.get('@firstSwitch').should('be.checked');

    cy.get('@secondSwitch').should('not.be.checked');
    cy.get('@secondSwitch').click();
    cy.get('@secondSwitch').should('be.checked');

    cy.get('@disabledSwitch').should('be.disabled');
  });
});
