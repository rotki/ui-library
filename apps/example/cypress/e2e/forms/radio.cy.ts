describe('forms/Radio', () => {
  beforeEach(() => {
    cy.visit('/radios');
  });

  it('checks for radios', () => {
    cy.contains('h2[data-cy=radio-buttons]', 'Radio Buttons');
    cy.get('[data-cy=radio-wrapper]').as('contentWrapper');

    cy.get('@contentWrapper')
      .find('input[type="radio"]')
      .first()
      .as('firstRadio');
    cy.get('@contentWrapper')
      .find('input[type="radio"]')
      .eq(1)
      .as('secondRadio');
    cy.get('@contentWrapper')
      .find('input[type="radio"]')
      .eq(2)
      .as('thirdRadio');

    cy.get('@firstRadio').should('be.checked');
    cy.get('@secondRadio').should('not.be.checked');
    cy.get('@secondRadio').click();
    cy.get('@secondRadio').should('be.checked');
    cy.get('@firstRadio').should('be.checked');

    cy.get('@thirdRadio').should('not.be.checked');
    cy.get('@thirdRadio').click();
    cy.get('@thirdRadio').should('be.checked');
    cy.get('@secondRadio').should('be.checked');
  });

  it('checks for radio groups', () => {
    cy.contains('h2[data-cy=radio-group-buttons]', 'Radio Groups');
    cy.get('[data-cy=radio-group-wrapper]').as('contentWrapper');

    cy.get('@contentWrapper')
      .find('input[type="radio"]')
      .first()
      .as('firstRadio');
    cy.get('@contentWrapper')
      .find('input[type="radio"]')
      .eq(1)
      .as('secondRadio');
    cy.get('@contentWrapper')
      .find('input[type="radio"]')
      .eq(2)
      .as('thirdRadio');

    cy.get('@firstRadio').should('be.checked');
    cy.get('@secondRadio').should('not.be.checked');
    cy.get('@secondRadio').click();
    cy.get('@secondRadio').should('be.checked');
    cy.get('@firstRadio').should('not.be.checked');
    cy.get('@secondRadio')
      .invoke('val')
      .then((value) => {
        cy.get('@secondRadio')
          .parentsUntil('div[class*=wrapper]')
          .parent()
          .parentsUntil('div[class*=wrapper]')
          .parent()
          .find('.details')
          .should('contain.text', `Selected value: ${value?.toString()}`);
      });

    cy.get('@thirdRadio').should('not.be.checked');
    cy.get('@thirdRadio').click();
    cy.get('@thirdRadio').should('be.checked');
    cy.get('@secondRadio').should('not.be.checked');
    cy.get('@thirdRadio')
      .invoke('val')
      .then((value) => {
        cy.get('@thirdRadio')
          .parentsUntil('div[class*=wrapper]')
          .parent()
          .parentsUntil('div[class*=wrapper]')
          .parent()
          .find('.details')
          .should('contain.text', `Selected value: ${value?.toString()}`);
      });
  });
});
