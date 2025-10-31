describe('alerts', () => {
  beforeEach(() => {
    cy.visit('/alerts');
  });

  it('checks for alerts and alert text', () => {
    cy.contains('h2[data-cy=alerts]', 'Alerts');

    cy.get('div[class*=alert] button[class*=action]')
      .first()
      .as('actionButton');
    cy.get('div[class*=alert] button[class*=close]').first().as('closeButton');

    cy.get('@actionButton')
      .parentsUntil('div[class*=alert]')
      .parent()
      .contains('primary (0)');

    cy.get('@actionButton').click();

    cy.get('@actionButton')
      .parentsUntil('div[class*=alert]')
      .parent()
      .contains('primary (1)');

    cy.get('@closeButton')
      .parentsUntil('div[class*=alert]')
      .parent()
      .contains('primary (0)');

    cy.get('@closeButton').click();

    cy.get('@closeButton')
      .parentsUntil('div[class*=alert]')
      .parent()
      .contains('primary (0) (Closed)');
  });
});
