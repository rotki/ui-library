// https://docs.cypress.io/api/introduction/api.html

describe('dialog', () => {
  beforeEach(() => {
    cy.visit('/dialogs');
  });

  it('check persistent dialog', () => {
    cy.contains('h2[data-cy=dialogs]', 'Dialogs');

    cy.get('div[data-cy=dialog-0]').as('defaultDialog');

    // open dialog
    cy.get('@defaultDialog').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should not close the dialog
    cy.get('body').find('div[role=dialog]').type('{esc}');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should not close the dialog
    cy.get('body').find('div[role=dialog]').find('div[class*=_overlay_]').trigger('click', { force: true });
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // close the dialog
    cy.get('body').find('button[data-cy=close]').trigger('click');
    cy.get('body').find('div[role=dialog]').should('not.be.exist');
  });

  it('check non-persistent dialog', () => {
    cy.get('div[data-cy=dialog-1]').as('defaultDialog');

    // open dialog
    cy.get('@defaultDialog').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should close the dialog
    cy.get('body').find('div[role=dialog]').type('{esc}');
    cy.get('body').find('div[role=dialog]').should('not.exist');

    // open the dialog again
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=dialog]').should('be.visible');

    // should close the dialog too
    cy.get('body').find('div[role=dialog]').find('div[class*=_overlay_]').trigger('click', { force: true });
    cy.get('body').find('div[role=dialog]').should('not.exist');
  });
});
