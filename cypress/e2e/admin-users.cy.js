describe('The Admin Dashboard test', () => {
    beforeEach(()=>{
        cy.login('mario','admin')
    })
    it('Admin Dashboard creds',()=>{
      cy.get('[data-cy="profile-options-btn"]').click();
      cy.get('[data-cy="profile-btns"]').contains("Admin Dashboard").click();
      cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').first().click();
      cy.get('h3').should('contain', 'Users');
      cy.get('button').contains("Add New").click();
      cy.get('button').contains("Cancel").click();
      cy.get('button').contains("Add New").click();
      cy.get('input[name=first_name]').type('Cypress');
      cy.get('input[name=last_name]').type('Testing');
      cy.get('input[name=username]').type('cypressTesting');
      cy.get('input[name=email]').type('shivam.malan+TEST@koneksys.com');
      cy.get('button').contains("Save").click();
      cy.get('.rs-message-container').should('exist');
      cy.get('.rs-table-row').should('contain','shivam.malan+TEST@koneksys.com');
      cy.contains('shivam.malan+TEST@koneksys.com').parents('.rs-table-row').find('button[title="Delete"]').click();
      cy.get('button').contains("Yes").click();
      cy.get('.rs-message-container').should('contain','The content was successfully deleted');

    })
  })