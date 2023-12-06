describe('The Profile Page', () => {
  const env= Cypress.env();

  beforeEach(()=>{
    cy.login(env.username, env.password);
  });

  it('Profile Dropdown Test',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').first().click();
    cy.wait(2000);
    cy.get('input[name=first_name]').invoke('val').then(($btn) => {
      const txt = $btn;
      cy.get('input[name=first_name]').type(' 2').invoke('val').should(($btn2) => {
        expect($btn2).not.to.eq(txt);
      });
      cy.get('form[data-cy="profile-form"]').submit();
      cy.get('form button[data-cy="profile-save"]').click();
      cy.wait(2000);
      cy.get('h5').should('contain',`${txt} 2`);
    });
    cy.get('.rs-message-error').should('not.exist');
  });
});