// https://docs.cypress.io/api/introduction/api.html

describe('Chip', () => {
  beforeEach(() => {
    cy.visit('/chips');
  });

  it('checks for chip and dismiss', () => {
    cy.contains('h2[data-cy=chips]', 'Chips');

    cy.get('[data-cy*=chip-0').first().as('dismissibleChip');
    cy.get('[data-cy*=chip-6').first().as('disabledChip');
    cy.get('[data-cy*=chip-12').first().as('inDismissibleChip');

    cy.get('@dismissibleChip').find('button').should('not.be.disabled');
    cy.get('@dismissibleChip').find('button').trigger('click');
    cy.get('@dismissibleChip').find('+ div').contains('1 times');
    cy.get('@dismissibleChip').find('button').trigger('click');
    cy.get('@dismissibleChip').find('+ div').contains('2 times');

    cy.get('@disabledChip').find('button').should('be.disabled');
    cy.get('@disabledChip').contains('+ div', '1 times').should('not.exist');

    cy.get('@inDismissibleChip').contains('button').should('not.exist');
  });
});
