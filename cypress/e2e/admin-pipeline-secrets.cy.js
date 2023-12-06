describe('The Admin Dashboard test', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });

  it('Admin Dashboard Pipeline Config',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains('Admin Dashboard').click();
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').eq(6).click();
    cy.get('h3').should('contain', 'Pipeline Secrets');
    cy.get('button').contains('Add New').click();
    cy.get('button').contains('Cancel').click();
    cy.get('.rs-message-error').should('not.exist');
    cy.intercept('GET', `${env.apiUrl}/1/pipeline_secret?page=1&per_page=10`).as('getComment');
    cy.wait('@getComment').then((i)=>{
      assert.isNotNull(i.response.body,' API calls');
    });
  });
});