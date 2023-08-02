// https://docs.cypress.io/api/introduction/api.html

describe('Tooltip', () => {
  beforeEach(() => {
    cy.visit('/tooltips');
  });

  it('checks for and trigger tooltip', () => {
    cy.contains('h2[data-cy=tooltips]', 'Tooltips');

    cy.get('div[data-cy=tooltip-0]').as('defaultTooltip');

    cy.get('@defaultTooltip').find('div[class*=_trigger_]');
    cy.get('@defaultTooltip').trigger('mouseover');
    cy.get('@defaultTooltip').find('div[role=tooltip]');
    cy.get('@defaultTooltip').trigger('mouseleave');
    cy.get('@defaultTooltip').find('div[role=tooltip]').should('not.exist');
  });

  it('checks for and trigger arrow tooltip', () => {
    cy.get('div[data-cy=tooltip-4]').as('tooltipWithArrow');

    cy.get('@tooltipWithArrow').find('div[class*=_trigger_]');
    cy.get('@tooltipWithArrow').trigger('mouseover');
    cy.get('@tooltipWithArrow').find('div[role=tooltip]');
    cy.get('@tooltipWithArrow').find('span[data-popper-arrow]');
    cy.get('@tooltipWithArrow').trigger('mouseleave');
    cy.get('@tooltipWithArrow').find('div[role=tooltip]').should('not.exist');
    cy.get('@tooltipWithArrow')
      .find('span[data-popper-arrow]')
      .should('not.exist');
  });

  it('disabled should not trigger tooltip', () => {
    cy.get('div[data-cy=tooltip-8]').as('disabledTooltip');

    cy.get('@disabledTooltip').find('div[class*=_trigger_]');
    cy.get('@disabledTooltip').trigger('mouseover');
    cy.get('@disabledTooltip').find('div[role=tooltip]').should('not.exist');
  });
});
