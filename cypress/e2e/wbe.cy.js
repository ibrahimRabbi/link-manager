describe('WBE Website visit', () => {
    it('WBE Tracelynx test',()=>{
        cy.visit('/wbe?sourceType=http%3A%2F%2Fopen-services.net%2Fns%2Fcm%23Task&resourceTypeLabel=Task&title=Attach%20extra%20properties%20in%20the%20LM%20native%20Preview%20UI&titleLabel=LM-255&project=Projects&uri=https%3A%2F%2Fkoneksys.atlassian.net%2Fbrowse%2FLM-255&origin=https://koneksys.atlassian.net&appName=jira&id=LM-255');
        cy.request(Cypress.env('apiUrl'));
        cy.get('input[name=userName]').type('mario')
        cy.get('input[name=password]').type(`${'admin'}{enter}`, { log: false });
        cy.get('#search_term-4').type('issue');
        cy.get('button').contains("Search").click();
        cy.get('button').contains("Create Link").click();
        cy.get('.css-w9q2zk-Input2').click();
        cy.get('#react-select-3-input').clear().type("solvedBy")
        cy.get('.css-o9ehiq-loadingIndicator').should('not.exist')
        cy.get('#react-select-3-listbox').first().click()
        cy.wait(3000);
        cy.get('#react-select-5-input').clear().type("Gitlab")
        cy.get('#react-select-5-listbox').first().click();
        cy.wait(2000);
        cy.get('#react-select-7-input').clear().type("Cross-Domain Integration Demo")
        cy.get('#react-select-7-listbox').first().click();
        cy.wait(2000);
        cy.get('#react-select-11-input').clear().type("Cross-Domain Integration Demo")
        cy.get('#react-select-11-listbox').first().click();
        cy.wait(2000);
        //cy.get('[aria-label="README.md"] > .rs-check-tree-node-label > .rs-check-item > .rs-checkbox-checker > label > .rs-checkbox-wrapper').click();
        cy.get('[value="README.md"] > .rs-check-tree-node-label > .rs-check-item > .rs-checkbox-checker > label > .rs-checkbox-wrapper').click();
        cy.get('button').contains("OK").click();
        cy.wait('500');
        cy.get('#menuitem-\:r5\:').click();
        cy.get('[data-id="layer0-selectbox"]').should('exist');
    })
  })