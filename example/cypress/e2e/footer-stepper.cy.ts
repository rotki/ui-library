// https://docs.cypress.io/api/introduction/api.html

describe('FooterStepper', () => {
  beforeEach(() => {
    cy.visit('/steppers');
  });

  it('checks for footer steppers and stepper text', () => {
    cy.contains('h2[data-cy=footer-steppers]', 'Footer Steppers');

    cy.get('div[class*=_footer-stepper][class*=_numeric]')
      .first()
      .as('numericStepper');

    cy.get('div[class*=_footer-stepper][class*=_bullet]')
      .first()
      .as('bulletStepper');

    cy.get('div[class*=_footer-stepper][class*=_progress]')
      .first()
      .as('progressStepper');

    cy.get('div[class*=_footer-stepper][class*=_pill]')
      .first()
      .as('pillStepper');

    cy.get('@numericStepper').find('button').contains('span', 'Back');
    cy.get('@numericStepper').find('button').contains('span', 'Next');
    cy.get('@numericStepper').contains('span', '1/5');

    cy.get('@bulletStepper').find('button').contains('span', 'Back');
    cy.get('@bulletStepper').find('button').contains('span', 'Next');
    cy.get('@bulletStepper').find('div[class*=_bullets] span[class*=_bullet]');

    cy.get('@progressStepper').find('button').contains('span', 'Back');
    cy.get('@progressStepper').find('button').contains('span', 'Next');
    cy.get('@progressStepper').find(
      'div[class*=_progress] div[class*=_determinate]',
    );

    cy.get('@pillStepper').contains('button span', 'Back').should('not.exist');
    cy.get('@pillStepper').contains('button span', 'Next').should('not.exist');
    cy.get('@pillStepper').find('div[class*=_pills] span[class*=_pill]');
  });
});
