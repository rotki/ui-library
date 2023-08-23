// https://docs.cypress.io/api/introduction/api.html

describe('Dialog', () => {
  beforeEach(() => {
    cy.visit('/cards');
  });

  it('checks for rendered cards', () => {
    cy.contains('h2[data-cy=cards]', 'Cards');

    cy.get('div[data-cy=card-0-0]').as('card');
    cy.get('@card').find('h5[class*=_header_]').as('header');
    cy.get('@card').find('p[class*=_subheader_]');
    cy.get('@card').find('div[class*=_content_]');
    cy.get('@card').find('div[class*=_footer_]');
    cy.get('@card').find('button[data-cy=card-action-0]');
    cy.get('@card').find('button[data-cy=card-action-1]').as('action');

    cy.get('@action').click();
    cy.get('@card').should('contain.text', 'clicks: 1');
  });

  it('checks for divided outline card', () => {
    cy.get('div[data-cy=card-0-1]').as('card');
    cy.get('@card')
      .first()
      .should((card) => {
        const classes = Cypress.$(card).attr('class');
        expect(classes).to.contain('_divide_');
        expect(classes).to.contain('_outlined_');
      });
    cy.get('@card')
      .find('div[class*=_content_]')
      .should('have.css', 'border-color');
    cy.get('@card')
      .find('div[class*=_footer_]')
      .should('have.css', 'border-color');
  });

  it('checks for outline card with image', () => {
    cy.get('div[data-cy=card-0-6]').as('card');
    cy.get('@card').find('div[class*=_image_]').should('have.css', 'overflow');
    cy.get('@card')
      .find('div[class*=_footer_]')
      .should('have.css', 'border-color');
    cy.get('@card').find('img').should('have.attr', 'src');
  });

  it('checks for elevated flat card', () => {
    cy.get('div[data-cy=card-1-4]').as('card');
    cy.get('@card')
      .first()
      .should((card) => {
        const classes = Cypress.$(card).attr('class');
        expect(classes).to.contain('shadow-1');
        expect(classes).to.not.contain('_outlined_');
      });
  });
});
