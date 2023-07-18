// https://docs.cypress.io/api/introduction/api.html

describe('Stepper', () => {
  beforeEach(() => {
    cy.visit('/steppers');
  });

  it('checks for steppers and stepper text', () => {
    cy.contains('h2[data-cy=steppers]', 'Steppers');

    cy.get('div[class*=_stepper]').first().as('horizontalStepper');
    cy.get('div[class*=_stepper][class*=_vertical]')
      .first()
      .as('verticalStepper');

    cy.get('@horizontalStepper')
      .find('div[class*=_step][class*=_inactive]')
      .contains('Inactive');
    cy.get('@horizontalStepper')
      .find('div[class*=_step][class*=_success]')
      .contains('Success');
  });
});
