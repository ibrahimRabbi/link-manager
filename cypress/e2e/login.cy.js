describe('The Login Page', () => {
    beforeEach(()=>{
        cy.login('shivam','Swayamskm11')
    });
    it('Login successfull',()=>{
      cy.get('h3').should('contain', 'Dashboard');
      cy.get('.link-nav-container').find('ul a.rs-sidenav-item-active').should('contain','Dashboard');
    });
  })