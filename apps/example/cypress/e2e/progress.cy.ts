// https://docs.cypress.io/api/introduction/api.html

describe('progress', () => {
  beforeEach(() => {
    cy.visit('/progress');
  });

  it('checks for progress and the variants', () => {
    cy.contains('h2[data-cy=progress]', 'Progress');

    cy.get('div[class*=_progress][class*=_determinate]')
      .first()
      .as('determinateProgress');

    cy.get('div[class*=_progress][class*=_indeterminate]')
      .first()
      .as('indeterminateProgress');

    cy.get('div[class*=_progress][class*=_buffer]')
      .first()
      .as('bufferProgress');

    cy.get('div[class*=_circular][class*=_determinate]')
      .first()
      .as('circularProgress');

    cy.get('@determinateProgress').find('div[class*=_rail]');
    cy.get('@determinateProgress').find('div[class*=_determinate]');

    cy.get('@indeterminateProgress').find('div[class*=_rail]');
    cy.get('@indeterminateProgress').find('div[class*=_indeterminate]');

    cy.get('@bufferProgress').find('div[class*=_buffer-dots]');
    cy.get('@bufferProgress').find('div[class*=_buffer-rail]');
    cy.get('@bufferProgress').find('div[class*=_buffer]');

    cy.get('@circularProgress').find('svg circle');
  });
});
