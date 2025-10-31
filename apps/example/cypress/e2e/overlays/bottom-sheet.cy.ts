// https://docs.cypress.io/api/introduction/api.html

describe('bottom-sheet', () => {
  beforeEach(() => {
    cy.visit('/bottom-sheets');
  });

  it('check persistent bottom sheet', () => {
    cy.contains('h2[data-cy=bottom-sheets]', 'Bottom Sheets');

    cy.get('div[data-cy=bottom-sheet-0]').as('defaultBottomSheet');

    // open bottom sheet
    cy.get('@defaultBottomSheet').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should not close the bottom sheet
    cy.get('body').find('div[role=dialog]').type('{esc}');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should not close the bottom sheet
    cy.get('body').find('div[role=dialog]').find('div[class*=_overlay_]').trigger('click', { force: true });
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // close the bottom sheet
    cy.get('body').find('button[data-cy=close]').trigger('click');
    cy.get('body').find('div[role=dialog]').should('not.be.exist');
  });

  it('check non-persistent bottom sheet', () => {
    cy.get('div[data-cy=bottom-sheet-1]').as('defaultBottomSheet');

    // open bottom sheet
    cy.get('@defaultBottomSheet').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should close the bottom sheet
    cy.get('body').find('div[role=dialog]').type('{esc}');
    cy.get('body').find('div[role=dialog]').should('not.exist');

    // open the bottom sheet again
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should close the bottom sheet too
    cy.get('body').find('div[role=dialog]').find('div[class*=_overlay_]').trigger('click', { force: true });
    cy.get('body').find('div[role=dialog]').should('not.exist');
  });
});
