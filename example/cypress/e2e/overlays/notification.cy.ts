// https://docs.cypress.io/api/introduction/api.html

describe('notification', () => {
  beforeEach(() => {
    cy.visit('/notification');
  });

  it('toggles through button', () => {
    cy.get('[data-cy="content"]').should('not.exist');
    cy.get('[data-cy="visibility-toggle"]').click();
    cy.get('[data-cy="content"]').should('exist');
    cy.get('[data-cy="content"]').should('contain.text', 'This is a notification');
    cy.get('[data-cy="visibility-toggle"]').click();
    cy.get('[data-cy="content"]').should('not.exist');
  });

  it('dismisses by click', () => {
    cy.get('[data-cy="content"]').should('not.exist');
    cy.get('[data-cy="visibility-toggle"]').click();
    cy.get('[data-cy="content"]').should('exist');
    cy.get('[data-cy="content"]').click();
    cy.get('[data-cy="content"]').should('not.exist');
  });

  it('does not dismisses by click if timeout is negative', () => {
    cy.get('[data-cy="timeout"]').type('-1');
    cy.get('[data-cy="content"]').should('not.exist');
    cy.get('[data-cy="visibility-toggle"]').click();
    cy.get('[data-cy="content"]').should('exist');
    cy.get('[data-cy="content"]').click();
    cy.get('[data-cy="content"]').should('exist');
  });

  it('auto dismisses on timeout', () => {
    cy.get('[data-cy="timeout"]').type('100');
    cy.get('[data-cy="content"]').should('not.exist');
    cy.get('[data-cy="visibility-toggle"]').click();
    cy.get('[data-cy="content"]').should('exist');
    cy.get('[data-cy="content"]').should('not.exist');
  });
});
