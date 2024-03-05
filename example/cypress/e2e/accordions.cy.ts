// https://docs.cypress.io/api/introduction/api.html

describe('accordions', () => {
  beforeEach(() => {
    cy.visit('/accordions');
  });

  it('check for rendered tabs', () => {
    cy.contains('h2[data-cy=accordions]', 'Accordions');

    cy.get('[data-cy=wrapper-0]').as('wrapper');

    cy.get('@wrapper')
      .find('[data-cy=accordions]')
      .as('accordions');

    cy.get('@accordions').children().should('have.length', 2);
    cy.get('@accordions')
      .find('div:first-child .accordion__header')
      .click();

    cy.get('@accordions').should('contain.text', 'Accordion 1 Content');

    cy.get('@accordions')
      .find('div:nth-child(2) .accordion__header')
      .click();

    cy.get('@accordions').should('not.contain.text', 'Accordion 1 Content');
    cy.get('@accordions').should('contain.text', 'Accordion 2 Content');
  });

  it('pass `multiple` props', () => {
    cy.get('[data-cy=wrapper-1]').as('wrapper');

    cy.get('@wrapper')
      .find('[data-cy=accordions]')
      .as('accordions');

    cy.get('@accordions').children().should('have.length', 2);
    cy.get('@accordions')
      .find('div:first-child .accordion__header')
      .click();

    cy.get('@accordions').should('contain.text', 'Accordion 1 Content');
    cy.get('@accordions').should('not.contain.text', 'Accordion 2 Content');

    cy.get('@accordions')
      .find('div:nth-child(2) .accordion__header')
      .click();

    cy.get('@accordions').should('contain.text', 'Accordion 1 Content');
    cy.get('@accordions').should('contain.text', 'Accordion 2 Content');

    cy.get('@accordions')
      .find('div:first-child .accordion__header')
      .click();

    cy.get('@accordions').should('not.contain.text', 'Accordion 1 Content');
    cy.get('@accordions').should('contain.text', 'Accordion 2 Content');
  });
});
