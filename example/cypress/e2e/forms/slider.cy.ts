describe('forms/Slider', () => {
  beforeEach(() => {
    cy.visit('/sliders');
  });

  it('checks for sliders', () => {
    cy.contains('h2[data-cy=sliders]', 'Sliders');

    cy.get('input[type="range"]').first().as('firstSlider');
    cy.get('h2[data-cy=sliders] + div > div').eq(2).as('secondWrapper');
    cy.get('input[type="range"][disabled]').first().as('disabledSlider');

    cy.get('@firstSlider').should('have.value', '50');
    cy.get('@firstSlider').invoke('val', 30)
      .trigger('change');
    cy.get('@firstSlider').should('have.value', '30');

    cy.get('@secondWrapper').should('contain.text', 'With Label');

    cy.get('@disabledSlider').should('be.disabled');
  });
});
