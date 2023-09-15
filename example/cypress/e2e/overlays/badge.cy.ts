// https://docs.cypress.io/api/introduction/api.html

describe('Badge', () => {
  beforeEach(() => {
    cy.visit('/badges');
  });

  it('checks for and trigger badge', () => {
    cy.contains('h2[data-cy=badges]', 'Badges');

    cy.get('div[data-cy=badge-0]').as('defaultBadge');
    cy.get('@defaultBadge').find('div[role=status]').should('exist');

    cy.get('@defaultBadge').find('> button').click();
    cy.get('@defaultBadge').find('div[role=status]').should('not.exist');
    cy.get('@defaultBadge').find('> button').click();
    cy.get('@defaultBadge').find('div[role=status]').should('exist');
  });

  it('checks for and trigger dot badge', () => {
    cy.get('div[data-cy=badge-84]').as('dotBadge');
    cy.get('@dotBadge').find('div[role=status]').should('exist');

    cy.get('@dotBadge').find('> button').click();
    cy.get('@dotBadge').find('div[role=status]').should('not.exist');
    cy.get('@dotBadge').find('> button').click();
    cy.get('@dotBadge').find('div[role=status]').should('exist');
  });
});
