// https://docs.cypress.io/api/introduction/api.html

describe('calendar', () => {
  beforeEach(() => {
    cy.visit('/calendars');
  });

  it('checks for rendered calendar', () => {
    cy.contains('h2[data-cy=calendars]', 'Calendar');

    cy.get('.id-2023-01-02').find('.vc-focusable').should('be.exist');
  });
});
