describe('forms/Checkbox', () => {
  beforeEach(() => {
    cy.visit('/checkboxes');
  });

  it('checks for checkboxes', () => {
    cy.contains('h2[data-cy=checkboxes]', 'Checkboxes');

    cy.get('input[type="checkbox"]').first().as('firstCheckbox');
    cy.get('input[type="checkbox"]').eq(1).as('secondCheckbox');
    cy.get('input[type="checkbox"][disabled]').first().as('disabledCheckbox');

    cy.get('@firstCheckbox').should('not.be.checked');
    cy.get('@firstCheckbox').click();
    cy.get('@firstCheckbox').should('be.checked');

    cy.get('@secondCheckbox').should('not.be.checked');
    cy.get('@secondCheckbox').click();
    cy.get('@secondCheckbox').should('be.checked');

    cy.get('@disabledCheckbox').should('be.disabled');
  });
});
