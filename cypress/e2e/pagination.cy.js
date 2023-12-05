describe('The Admin Dashboard test', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });
  
  it('Admin Dashboard Pagination',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains('Admin Dashboard').click();
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').first().click();
    cy.get('h3').should('contain', 'Users');
    cy.get('button').contains('Add New').click();
    cy.get('button').contains('Cancel').click();
    cy.wait(2000);
    cy.get('[aria-label="2"]').click();
    cy.get('.rs-pagination-group-total > :nth-child(2)').invoke('text').then(val=>+val).then(val=> {
      if(expect(val).to.be.below(26)){
        cy.get('.rs-picker-toggle').contains('10').click();
        cy.get('[data-key="25"] > .rs-picker-select-menu-item').click();
        cy.get('.rs-picker-toggle').should('contain','25');
        cy.get('.rs-pagination-group-total').should('contain','25');
        cy.get('[aria-label="2"]').should('not.exist');
      } else{
        cy.get('.rs-picker-toggle').contains('10').click();
        cy.get('[data-key="25"] > .rs-picker-select-menu-item').click();
        cy.get('.rs-picker-toggle').should('contain','25');
        cy.get('.rs-pagination-group-total').should('contain','25');
        cy.get('[aria-label="2"]').should('exist');
      }
    });
      

  });
});