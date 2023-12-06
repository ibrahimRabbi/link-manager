describe('The Admin Dashboard test', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });
  
  it('Admin Dashboard Link Rules',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains('Admin Dashboard').click();
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').eq(4).click();
    cy.get('h5').should('contain', 'Link Rules');
    cy.get('button').contains('Add New').click();
    cy.get('button').contains('Cancel').click();
  });
});