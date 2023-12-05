describe('The Admin Dashboard test', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });
  
  it('Admin Dashboard Pipeline Config',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains('Admin Dashboard').click();
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').eq(7).click();
    cy.get('h3').should('contain', 'Pipeline Configuration');
    cy.get('button').contains('Add New').click();
    cy.get('button').contains('Cancel').click();
  });
});