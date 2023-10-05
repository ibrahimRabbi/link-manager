describe('The Dark theme test', () => {
    beforeEach(()=>{
        cy.login('mario','admin')
    })
    it('Dark theme switch',()=>{
      cy.get('.rs-theme-light').should('exist');
      cy.get('[data-cy="profile-options-btn"]').click();
      cy.get('[data-cy="profile-btns"]').contains("Dark Mode").click();
      cy.get('.rs-theme-dark').should('exist');
      cy.get('.rs-theme-light').should('not.exist');
      cy.get('[data-cy="profile-btns"]').contains("Light Mode").click();
      cy.get('.rs-theme-dark').should('not.exist');
      cy.get('.rs-theme-light').should('exist');
    })
  })