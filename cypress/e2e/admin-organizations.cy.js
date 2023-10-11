describe('The Admin Dashboard test', () => {
    beforeEach(()=>{
        cy.login('mario','admin')
    })
    it('Admin Dashboard Organizations Creation',()=>{
      cy.get('[data-cy="profile-options-btn"]').click();
      cy.get('[data-cy="profile-btns"]').contains("Admin Dashboard").click();
      cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').eq(1).click();
      cy.get('h3').should('contain', 'Organizations');
      cy.get('button').contains("Add New").click();
      cy.get('#name-4').clear().type('Cypress Testing');
      cy.get('#description-4').clear().type('Cypress Testing is in process for organization creation');
      cy.get('button').contains("Save").click();
      cy.get('.rs-message-container').should('exist');
      cy.get('.rs-table-row').should('contain','Cypress Testing');
      cy.contains('Cypress Testing').parents('.rs-table-row').find('button[title="Edit"]').click();
      cy.get('#name-4').type(' 2');
      cy.get('#description-4').type(' test.');
      cy.get('button').contains("Save").click();
      cy.get('.rs-message-error').should('not.exist')
      cy.wait(2000);
      cy.contains('Cypress Testing 2').parents('.rs-table-row').find('button[title="Delete"]').click();
      cy.get('button').contains("Yes").click();
      cy.get('.rs-message-container').should('contain','The content was successfully deleted');
    })
  })