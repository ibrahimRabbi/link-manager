describe('The Profile Page', () => {
  beforeEach(()=>{
      cy.login('mario','admin')
  })
  it('Profile Dropdown Test',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').first().click();
    cy.get('input[name=first_name]').invoke('val').then(($btn) => {
      const txt = $btn;
      cy.intercept('PUT', 'https://lm-api-dev.koneksys.com/api/v1/user/45').as('getComment');
      cy.get('form[data-cy="profile-form"]').submit();
      cy.get('form button[data-cy="profile-save"]').click();
      cy.get('input[name=first_name]').type(' 2').invoke('val').should(($btn2) => {
        expect($btn2).not.to.eq(txt)
      })
      cy.get('h5').should('contain',`${txt} 2`)
    })
    cy.get('.rs-message-error').should('not.exist');
  })
})