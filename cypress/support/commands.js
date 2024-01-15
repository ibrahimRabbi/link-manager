// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
import 'cypress-mailosaur'
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })



Cypress.Commands.add('login', (username, password) => {

  cy.visit('/login')
  cy.get('form').then(form => {
    cy.wrap(form).get('input[name=userName]').type(username).should('have.value', username)
    cy.wrap(form).get('input[name=password]').type(password).should('have.value', password)
    cy.wrap(form).get('[type="submit"]').click({ force: true })
  })
});




//const log = Cypress.log({
//   displayName: 'AUTH LOGIN',
//   message: [`🔐 Authenticating | ${username}`],
//   // @ts-ignore
//   autoEnd: false,
// });
// log.snapshot('before login');
// cy.visit('/login');
// cy.get('input[name=userName]').type(username);
// cy.get('input[name=password]').type(`${password}{enter}`, { log: false });
// log.snapshot('after login');
// log.end();