describe('WBE Website visit', () => {
    it('WBE Tracelynx test',()=>{
        cy.visit('/wbe?sourceType=http%3A%2F%2Fopen-services.net%2Fns%2Fcm%23Task&resourceTypeLabel=Task&title=Attach%20extra%20properties%20in%20the%20LM%20native%20Preview%20UI&titleLabel=LM-255&project=Projects&uri=https%3A%2F%2Fkoneksys.atlassian.net%2Fbrowse%2FLM-255&origin=https://koneksys.atlassian.net&appName=jira&id=LM-255');
        cy.request(Cypress.env('apiUrl'));
        cy.get('input[name=userName]').type('mario')
        cy.get('input[name=password]').type(`${'admin'}{enter}`, { log: false });
        cy.get('#search_term-4').type('issue');
        cy.get('button').contains("Search").click();
    })
  })