/// <reference types="Cypress" />


describe('forget password validation test', () => {
    // const serverID = 'nbgcx2si'
     const email = `${new Date().getTime()}@nbgcx2si.mailosaur.net`
    // const apiKey = 'soMbRVhPosLYSItZpYvWo9YF6qqoMMB6'

    beforeEach('application run', () => {
        cy.visit('/login')
    })
     
    it('forget password', () => {
        cy.get('form').contains('Forgot password?').click()
        cy.get('input[type="email"]').type(email)
        cy.get('button').contains('Send recovery email').click()
        cy.get('._sendEmailMess_1fuha_107').should('contain','If the email is registered, then an email will arrive in the inbox.')
        // cy.mailosaurGetMessage(serverID, { sentTo: email })
        //     .then(res => {
        //      cy.log(res)
        // })
    })

     
})

