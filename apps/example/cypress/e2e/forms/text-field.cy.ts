describe('forms/TextField', () => {
  beforeEach(() => {
    cy.visit('/text-fields');
  });

  it('checks for text-fields and', () => {
    cy.contains('h2[data-cy=text-fields]', 'Text Fields');

    cy.get('h2[data-cy=text-fields] + div input').first().as('firstText');
    cy.get('h2[data-cy=text-fields] + div input').eq(2).as('secondText');
    cy.get('h2[data-cy=text-fields] + div input[disabled]')
      .first()
      .as('disabledText');

    cy.get('@firstText').should('have.value', '');
    cy.get('@firstText').type('value');
    cy.get('@firstText').should('have.value', 'value');

    cy.get('@secondText').should('have.value', '');
    cy.get('@secondText').type('value');
    cy.get('@secondText').should('have.value', 'value');

    cy.get('@disabledText').should('be.disabled');
  });
});
