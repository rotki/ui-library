// https://docs.cypress.io/api/introduction/api.html

describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('/tabs');
  });

  it('check for rendered tabs', () => {
    cy.contains('h2[data-cy=tabs]', 'Tabs');

    cy.get('[data-cy=wrapper-0]').as('wrapper');

    cy.get('@wrapper')
      .find('[data-cy=tabs]')
      .find('[role=tablist]')
      .as('tablist');

    cy.get('@tablist').children().should('have.length', 6);
    cy.get('@tablist')
      .find('button:first-child')
      .should('have.class', 'active-tab');
    cy.get('@tablist').find('button:nth-child(2)').should('be.disabled');

    cy.get('@wrapper').find('[data-cy=tab-items]').as('tabcontent');

    cy.get('@tabcontent').should('have.text', 'Tab 1 Content');

    // Click third tab
    cy.get('@tablist').find('button:nth-child(3)').click();
    cy.get('@tabcontent').should('have.text', 'Tab 3 Content');

    // Click last tab should redirect to stepper page
    cy.get('@tablist').find('a:last-child').click();

    cy.url().should('contain', '/steppers');
  });
});
