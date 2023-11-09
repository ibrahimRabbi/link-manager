it('should show validation error when leaving all the fields blank', () => {
  cy.visit('http://localhost:5173/login');
  cy.get('[data-cy="login-submit"]').click();
  cy.get('.rs-message-error').should('not.exist');
})