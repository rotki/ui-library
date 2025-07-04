// https://docs.cypress.io/api/introduction/api.html

describe('calendar', () => {
  beforeEach(() => {
    cy.visit('/calendars');
  });

  it('checks for rendered calendar', () => {
    cy.contains('h2[data-cy=calendars]', 'Calendar');

    cy.get('[data-id="2023-01-02"]').should('have.class', 'bg-rui-primary');
    cy.get('[data-id="2023-01-02"]').should('have.class', 'text-white');
    cy.get('[data-id="2023-01-01"]').should('not.have.class', 'bg-rui-primary');
    cy.get('[data-id="2023-01-01"]').should('not.have.class', 'text-white');
    cy.get('[data-id="2023-01-03"]').should('not.have.class', 'bg-rui-primary');
    cy.get('[data-id="2023-01-03"]').should('not.have.class', 'text-white');
  });
});
