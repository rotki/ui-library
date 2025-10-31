// https://docs.cypress.io/api/introduction/api.html

describe('navigation drawer', () => {
  beforeEach(() => {
    cy.visit('/navigation-drawers');
  });

  it('check non-persistent navigation-drawer', () => {
    cy.contains('h2[data-cy=navigation-drawers]', 'Navigation Drawers');

    cy.get('div[data-cy=navigation-drawer-0]').as('defaultDrawer');

    // open dialog
    cy.get('@defaultDrawer').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('aside').should('be.visible');

    // should close the dialog
    cy.get('h2[data-cy=navigation-drawers]').trigger('click');
    cy.get('body').find('aside').should('not.be.visible');
  });

  it('check persistent dialog', () => {
    cy.get('div[data-cy=navigation-drawer-2]').as('defaultDrawer');

    // open dialog
    cy.get('@defaultDrawer').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('aside').should('be.visible');

    // should not close the dialog
    cy.get('h2[data-cy=navigation-drawers]').trigger('click');
    cy.get('body').find('aside').should('be.visible');
  });
});
