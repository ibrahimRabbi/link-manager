describe('The Admin Dashboard test', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });
  
  it('Admin Dashboard Projects',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains('Admin Dashboard').click();
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').eq(3).click();
    cy.get('h3').should('contain', 'Projects');
    cy.get('button').contains('Add New').click();
    cy.get('#name-4').clear().type('Cypress Testing');
    cy.get('#description-4').clear().type('Cypress Testing is in process for project creation');
    cy.get('.css-art2ul-ValueContainer2').click();
    cy.get('#react-select-3-input').clear().type('test org');
    cy.get('#react-select-3-listbox').first().click();
    cy.get('button').contains('Save').click();
    cy.get('.rs-message-body').should('contain','successfully registered');
    cy.wait(1000);
    cy.contains('Cypress Testing').parents('.rs-table-row').find('button[title="Delete"]').click();
    cy.get('button').contains('Yes').click();
    cy.get('.rs-message-container').should('contain','The content was successfully deleted');
  });
});