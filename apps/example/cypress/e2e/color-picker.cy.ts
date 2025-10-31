// https://docs.cypress.io/api/introduction/api.html

describe('colorPicker', () => {
  beforeEach(() => {
    cy.visit('/color-pickers');
  });

  it('checks for rendered color picker', () => {
    cy.contains('h2[data-cy=color-pickers]', 'Color Pickers');

    cy.get('div[data-cy=color-picker-0]').as('firstColorPicker');
    cy.get('@firstColorPicker').find('input').should('contain.value', '000000');

    cy.get('div[data-cy=color-picker-1]').as('secondColorPicker');
    cy.get('@secondColorPicker').find('input').should('contain.value', '45858a');
  });
});
