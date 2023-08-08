// https://docs.cypress.io/api/introduction/api.html

describe('DataTable', () => {
  beforeEach(() => {
    cy.visit('/data-tables');
  });

  it('checks for data tables with column definition', () => {
    cy.contains('h2[data-cy=datatables]', 'Data Tables');

    cy.get('div[data-cy=table-0]').first().as('columnsDefined');

    cy.get('@columnsDefined')
      .find('table thead th span[class*=_column__text_]')
      .contains('address.street')
      .should('not.exist');

    cy.get('@columnsDefined')
      .find('table tbody td[class*=_align__left_]')
      .contains('1')
      .should('exist');

    cy.get('@columnsDefined')
      .find('table thead th[class*=_checkbox_]')
      .should('not.exist');

    cy.get('@columnsDefined')
      .find('table tbody td[class*=_checkbox_]')
      .should('not.exist');

    cy.get('@columnsDefined')
      .find('div div[class*=_limit_]')
      .should('not.exist');
  });

  it('checks for data tables without column definition', () => {
    cy.contains('h2[data-cy=datatables]', 'Data Tables');

    cy.get('div[data-cy=table-1]').first().as('columnsNotDefined');

    cy.get('@columnsNotDefined')
      .find('table thead th span[class*=_column__text_]')
      .contains('address.street')
      .should('exist');

    cy.get('@columnsNotDefined')
      .find('table tbody td[class*=_align__left_]')
      .contains('1')
      .should('exist');
  });

  it('checks for data tables with loading state and outling', () => {
    cy.contains('h2[data-cy=datatables]', 'Data Tables');

    cy.get('div[data-cy=table-2]').first().as('loading');

    cy.get('@loading')
      .find('table thead tr[class*=_thead__loader_] th[class*=_progress_]')
      .should('exist');

    cy.get('div[data-cy=table-3][class*=_outlined_]').first().as('outlined');

    cy.get('@outlined').should('exist');
  });
});
