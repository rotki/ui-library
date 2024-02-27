// https://docs.cypress.io/api/introduction/api.html

describe('menu', () => {
  beforeEach(() => {
    cy.visit('/menus');
  });

  it('checks for and trigger menu', () => {
    cy.contains('h2[data-cy=menus]', 'Menus');

    cy.get('div[data-cy=menu-0]').as('defaultMenu');

    cy.get('@defaultMenu').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=menu]');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=menu-content]').should('not.exist');

    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=menu-content]').should('exist').as('menuContent');
    cy.get('@menuContent').trigger('click');
    cy.get('body').find('div[role=menu-content]').contains('This is menu 0').should('exist');
    cy.get('body').trigger('click');
    cy.get('body').find('div[role=menu-content]').contains('This is menu 0').should('not.exist');
  });

  it('disabled should not trigger menu', () => {
    cy.get('div[data-cy=menu-4]').as('disabledMenu');

    cy.get('@disabledMenu').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=menu-content]').should('not.exist');
  });

  it('menu should be opened on hover', () => {
    cy.get('div[data-cy=menu-8]').as('menu');

    cy.get('@menu').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('mouseover');
    cy.get('body').find('div[role=menu-content]').should('exist');
    cy.get('@activator').trigger('mouseleave');
    cy.get('body').find('div[role=menu-content]').should('not.exist');

    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=menu-content]').should('exist');

    cy.get('@activator').trigger('mouseleave');
    cy.get('body').find('div[role=menu-content]').should('exist');

    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=menu-content]').should('not.exist');
  });

  it('menu should be closed by clicking the menu content', () => {
    cy.get('div[data-cy=menu-12]').as('menu');

    cy.get('@menu').find('[data-cy=activator]').as('activator');
    cy.get('@activator').trigger('click');
    cy.get('body').find('div[role=menu]').as('menuContent');
    cy.get('body').find('div[role=menu-content]');
    cy.get('@menuContent').trigger('click');
    cy.get('body').find('div[role=menu-content]').should('not.exist');
  });
});
