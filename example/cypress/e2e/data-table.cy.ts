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
      .find('table tbody td[class*=_align__start_]')
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
    cy.get('div[data-cy=table-1]').first().as('columnsNotDefined');

    cy.get('@columnsNotDefined')
      .find('table thead th span[class*=_column__text_]')
      .contains('address.street')
      .should('exist');

    cy.get('@columnsNotDefined')
      .find('table tbody td[class*=_align__start_]')
      .contains('1')
      .should('exist');
  });

  it('checks for empty data tables and outline', () => {
    cy.get('div[data-cy=table-empty-0]').first().as('empty');

    cy.get('@empty')
      .find('table tbody tr[class*=_tr__empty_] p[class*=_empty__label_]')
      .should('exist');

    cy.get('@empty')
      .find('table tbody tr[class*=_tr__empty_] p[class*=_empty__description_]')
      .should('exist');

    cy.get('div[data-cy=table-empty-0][class*=_outlined_]')
      .first()
      .as('outlined');

    cy.get('@outlined').should('exist');
  });

  it('checks for empty data tables, with empty slot action and outline', () => {
    cy.get('div[data-cy=table-empty-1]').first().as('empty');

    cy.get('@empty')
      .find('table tbody tr[class*=_tr__empty_] p[class*=_empty__label_]')
      .should('exist');

    cy.get('@empty')
      .find('table tbody tr[class*=_empty_] button[class*=_btn_]')
      .should('exist');

    cy.get('div[data-cy=table-empty-1][class*=_outlined_]')
      .first()
      .as('outlined');

    cy.get('@outlined').should('exist');
  });

  it('checks for empty data tables with loading state and outline', () => {
    cy.get('div[data-cy=table-empty-2]').first().as('loading');

    cy.get('@loading')
      .find(
        'table thead tr[class*=_thead__loader_] th[class*=_progress_] div[class*=_circular_]',
      )
      .should('exist');

    cy.get('div[data-cy=table-empty-2][class*=_outlined_]')
      .first()
      .as('outlined');

    cy.get('@outlined').should('exist');
  });

  it('checks for data tables with loading state and outline', () => {
    cy.get('div[data-cy=table-empty-3]').first().as('loading');

    cy.get('@loading')
      .find('table thead tr[class*=_thead__loader_] th[class*=_progress_]')
      .should('exist');

    cy.get('div[data-cy=table-3][class*=_outlined_]').first().as('outlined');

    cy.get('@outlined').should('exist');
  });

  it('checks for data tables with multiple expanded content', () => {
    cy.get('div[data-cy=table-expandable-0]').as('multiple');
    cy.get('@multiple')
      .find('tr button[class*=_tr__expander_button]')
      .as('buttons');
    cy.get('@buttons').eq(1).as('button1');
    cy.get('@buttons').eq(2).as('button2');

    cy.get('@multiple')
      .find('table tbody tr div[data-cy=expanded-content]')
      .should('not.exist');

    cy.get('@button1').click();

    cy.get('@button1').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).to.contain('_tr__expander_button');
      expect(classes).to.contain('_tr__expander_button_open');
    });

    cy.get('@button1').click();

    cy.get('@button1').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).not.to.contain('_tr__expander_button_open');
    });

    cy.get('@button1').click();
    cy.get('@button2').click();

    cy.get('@button1').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).to.contain('_tr__expander_button');
      expect(classes).to.contain('_tr__expander_button_open');
    });

    cy.get('@button2').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).to.contain('_tr__expander_button');
      expect(classes).to.contain('_tr__expander_button_open');
    });
  });

  it('checks for data tables with single expanded content', () => {
    cy.get('div[data-cy=table-expandable-1]').as('single');
    cy.get('@single')
      .find('tr button[class*=_tr__expander_button]')
      .as('buttons');
    cy.get('@buttons').eq(1).as('button1');
    cy.get('@buttons').eq(2).as('button2');

    cy.get('@single')
      .find('table tbody tr div[data-cy=expanded-content]')
      .should('not.exist');

    cy.get('@button1').click();

    cy.get('@button1').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).to.contain('_tr__expander_button');
      expect(classes).to.contain('_tr__expander_button_open');
    });

    cy.get('@button1').click();

    cy.get('@button1').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).not.to.contain('_tr__expander_button_open');
    });

    cy.get('@button1').click();
    cy.get('@button2').click();

    cy.get('@button1').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).not.to.contain('_tr__expander_button_open');
    });

    cy.get('@button2').should((btn) => {
      const classes = Cypress.$(btn).attr('class');
      expect(classes).to.contain('_tr__expander_button');
      expect(classes).to.contain('_tr__expander_button_open');
    });
  });

  it('checks for data tables with sticky header', () => {
    cy.get('div[data-cy="table-expandable-0"]').as('sticky');

    cy.get('@sticky')
      .find('> div > table > tbody > tr:nth-child(5)')
      .as('row4');

    cy.get('@sticky')
      .find('> div > table > thead[data-id=head-clone]')
      .should('exist');

    cy.get('@sticky')
      .find('> div > table > thead[data-id=head-main]')
      .as('mainHead')
      .should('exist');

    cy.get('@row4')
      .scrollIntoView()
      .get('@mainHead')
      .should((thead) => {
        const classes = Cypress.$(thead).attr('class');
        expect(classes).to.contain('_sticky__header_');
        expect(classes).not.to.contain('_stick__top_');
      });

    cy.window()
      .get('body')
      .scrollTo('top')
      .get('@mainHead')
      .should((thead) => {
        const classes = Cypress.$(thead).attr('class');
        expect(classes).not.to.contain('_stick__top_');
      });
  });
});
