/// <reference types="Cypress" />

describe('The Login Page', () => {

  beforeEach('application run', () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  it('Login successfull', () => {
    
    cy.intercept('POST', `${Cypress.env("apiUrl")}/auth/login`).as('login')

    cy.wait('@login').then(res => {
      expect(res.response.statusCode).to.equal(200)
      cy.wrap(res.response.body.access_token).should('exist')
      
      cy.get('h5').should('contain', 'Dashboard');
      cy.get('.link-nav-container').find('ul a.rs-sidenav-item-active').should('contain', 'Dashboard');
    })

  });
});