describe('The Admin Dashboard test', () => {
  beforeEach(()=>{
      cy.login('mario','admin')
  })
  it('Admin Dashboard Integrations',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains("Admin Dashboard").click();
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').eq(2).click();
    cy.get('h3').should('contain', 'Integrations');
    cy.get('button').contains("Add New").click();
    cy.get('button').contains("Cancel").click();
  })
})