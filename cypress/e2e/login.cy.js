describe('The Login Page', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });

  it('Login successfull',()=>{
    cy.get('h5').should('contain', 'Dashboard');
    cy.get('.link-nav-container').find('ul a.rs-sidenav-item-active').should('contain','Dashboard');
  });
});