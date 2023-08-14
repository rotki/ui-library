// https://docs.cypress.io/api/introduction/api.html

describe('Dialog', () => {
  beforeEach(() => {
    cy.visit('/dialogs');
  });

  it('checks for and trigger dialog', () => {
    cy.contains('h2[data-cy=dialogs]', 'Dialogs');

    cy.get('button[data-cy=dialog-trigger-0-0]').as('dialogTrigger');
    cy.get('@dialogTrigger').click();

    // on trigger, dialog should exist in portal including overlay, description, title, content and actions
    cy.get('#headlessui-portal-root div[role=dialog][data-cy=dialog-0-0]').as(
      'dialog',
    );
    cy.get('@dialog').find('div[class*=_overlay_]').as('overlay');
    cy.get('@dialog').find('p[class*=_description_]');
    cy.get('@dialog').find('h6[class*=_title_]');
    cy.get('@dialog').find('div[class*=_content_]');
    cy.get('@dialog').find('div[class*=_actions_]');
    cy.get('@dialog').find('button[data-cy=dialog-action-0-0-0]');
    cy.get('@dialog').find('button[data-cy=dialog-action-0-0-1]').as('action');
    // shoould not have dismissible button since the prop is not passed
    cy.get('@dialog').find('div[class*=_dismiss_] button').should('not.exist');

    // overlay click should close the modal
    cy.get('@overlay').click({ force: true });
    cy.get('@dialog').should('not.exist');

    // re-open the modal
    cy.get('@dialogTrigger').click();
    cy.get('@dialog').should('exist');

    // action click should also close the modal
    cy.get('@action').click();
    cy.get('@dialog').should('not.exist');
  });

  it('checks for and trigger dismissible dialog', () => {
    cy.get('button[data-cy=dialog-trigger-0-1]').as('dialogTrigger');
    cy.get('@dialogTrigger').trigger('click');

    cy.get('#headlessui-portal-root div[role=dialog][data-cy=dialog-0-1]').as(
      'dialog',
    );
    cy.get('@dialog').find('p[class*=_description_]');
    cy.get('@dialog').find('h6[class*=_title_]');
    cy.get('@dialog').find('div[class*=_content_]');
    cy.get('@dialog').find('div[class*=_actions_]').should('not.exist');
    cy.get('@dialog')
      .find('button[data-cy=dialog-action-0-1-0]')
      .should('not.exist');
    cy.get('@dialog')
      .find('button[data-cy=dialog-action-0-1-1]')
      .should('not.exist');
    cy.get('@dialog')
      .find('div[class*=_dismiss_] button')
      .should('exist')
      .as('dismiss');

    // action click should also close the modal
    cy.get('@dismiss').click();
    cy.get('@dialog').should('not.exist');
  });

  it('checks for and trigger non-persistent dialog', () => {
    cy.get('button[data-cy=dialog-trigger-0-2]').as('dialogTrigger');
    cy.get('@dialogTrigger').trigger('click');

    cy.get('#headlessui-portal-root div[role=dialog][data-cy=dialog-0-2]').as(
      'dialog',
    );
    cy.get('@dialog').find('div[class*=_overlay_]').as('overlay');
    cy.get('@dialog').find('div[class*=_dismiss_] button').as('dismiss');

    // overlay click should close the modal
    cy.get('@overlay').click({ force: true });
    cy.get('@dialog').should('not.exist');

    // re-open the modal
    cy.get('@dialogTrigger').click();
    cy.get('@dialog').should('exist');

    // dismiss button click should also close the modal
    cy.get('@dismiss').click();
    cy.get('@dialog').should('not.exist');
  });

  it('checks for and trigger persistent dialog', () => {
    cy.get('button[data-cy=dialog-trigger-0-3]').as('dialogTrigger');
    cy.get('@dialogTrigger').trigger('click');

    cy.get('#headlessui-portal-root div[role=dialog][data-cy=dialog-0-3]').as(
      'dialog',
    );
    cy.get('@dialog').find('div[class*=_overlay_]').as('overlay');
    cy.get('@dialog').find('div[class*=_dismiss_] button').should('not.exist');
    cy.get('@dialog').find('button[data-cy=dialog-action-0-3-1]').as('action');

    // overlay click should not close the persistent modal
    cy.get('@overlay').click({ force: true });
    cy.get('@dialog').should('exist');

    // action button click should close the modal
    cy.get('@action').click();
    cy.get('@dialog').should('not.exist');
  });
});
