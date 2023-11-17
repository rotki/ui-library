describe('Loaders', () => {
  beforeEach(() => {
    cy.visit('/loaders');
  });

  it('checks for text and heading skeleton loader', () => {
    cy.contains('h2[data-cy=skeleton-loader]', 'Skeleton Loader');

    cy.get('div[class*=skeleton_text]').first().as('defaultSkeleton');
    cy.get('div[class*=skeleton_heading]').first().as('headingSkeleton');

    cy.get('@defaultSkeleton').should('have.attr', 'role', 'alert');
    cy.get('@headingSkeleton').should('have.attr', 'role', 'alert');
  });

  it('checks for paragraph skeleton loader', () => {
    cy.get('div[class*=skeleton_paragraph]').first().as('paragraphSkeleton');

    cy.get('@paragraphSkeleton')
      .find('div[class*=skeleton_text]')
      .should('have.attr', 'role', 'alert');

    cy.get('@paragraphSkeleton')
      .invoke('attr', 'class')
      .should('match', /_skeleton_paragraph_/);
  });

  it('checks for article skeleton loader', () => {
    cy.get('div[class*=skeleton_article]').first().as('articleSkeleton');

    cy.get('@articleSkeleton')
      .find('div[class*=skeleton_heading]')
      .should('have.attr', 'role', 'alert');

    cy.get('@articleSkeleton')
      .find('div[class*=skeleton_text]')
      .should('have.attr', 'role', 'alert');

    cy.get('@articleSkeleton')
      .invoke('attr', 'class')
      .should('match', /_skeleton_article_/);
  });

  it('checks for other skeleton loaders', () => {
    cy.get('div[class*=skeleton_icon]').first().as('iconSkeleton');
    cy.get('div[class*=skeleton_avatar]').first().as('avatarSkeleton');
    cy.get('div[class*=skeleton_thumbnail]').first().as('thumbnailSkeleton');
    cy.get('div[class*=skeleton_custom]').first().as('customSkeleton');

    cy.get('@iconSkeleton').should('have.attr', 'role', 'alert');
    cy.get('@avatarSkeleton').should('have.attr', 'role', 'alert');
    cy.get('@thumbnailSkeleton').should('have.attr', 'role', 'alert');
    cy.get('@customSkeleton').should('have.attr', 'role', 'alert');
    cy.get('@customSkeleton')
      .should('have.class', 'w-20')
      .and('have.class', 'h-20');
  });
});
