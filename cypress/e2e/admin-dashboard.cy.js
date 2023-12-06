describe('The Admin Dashboard test', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });

  it('Admin Dashboard creds',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').first().click();
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('span.rs-tag-text p').contains('user').should('not.exist');
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains('Admin Dashboard').click();
    cy.get('h3').should('contain', 'Users');
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').should('contain','Users');
  });
});