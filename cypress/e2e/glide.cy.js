describe('WBE Website visit', () => {
    it('WBE Tracelynx test',()=>{
        cy.origin('https://identity-stage.glideyoke.com', ()=>{
            cy.visit('/auth/realms/master/protocol/openid-connect/auth?client_id=sp-services&redirect_uri=https%3A%2F%2Fui-stage.glideyoke.com%2F&state=1b49d1a6-3aec-45de-81f8-f84e7581aab2&response_mode=fragment&response_type=code&scope=openid&nonce=1754d507-4dc4-4bda-8954-ac33846a089f')
            cy.get('#username').type('superadmin')
            cy.get('#password').type(`${'superadmin'}{enter}`, { log: false });
        })
        cy.get(':nth-child(2) > .MuiListItem-root > .MuiButtonBase-root').click();
        cy.wait(3000)
        cy.get('a').contains('Software').click();
        cy.wait(1000);
        cy.get('.ag-pinned-left-cols-container > .ag-row-first > .ag-cell').click();
        cy.wait(4000)
        cy.get('.css-1wcggqr > button').click();
        cy.wait(1000)
        cy.get('.btn-wbe2 > .btn-wbe').click();
        cy.wait(1000);
        cy.get('.iframe-target-app').should('be.visible').then(($iframe)=>{
            const $body= $iframe.contents().find('body');
            cy.wrap($body).wait(3000);
            cy.wrap($body).find('input[name=userName]').type('mario')
            cy.wrap($body).find('input[name=password]').type('admin');
            cy.wrap($body).find('button[data-cy="login-submit"]').click();
            cy.wrap($body).find('button').contains('Create Link').click();
            cy.wrap($body).find('#react-select-3-input').clear().type("solvedBy")
            cy.wrap($body).find('.css-o9ehiq-loadingIndicator').should('not.exist')
            cy.wrap($body).find('#react-select-3-listbox').first().click()
            cy.wait(3000);
            cy.wrap($body).find('#react-select-5-input').clear().type("Jira")
            cy.wrap($body).find('#react-select-5-listbox').first().contains("Jira").click();
            cy.wait(3000);
            cy.wrap($body).find('#react-select-7-input').clear().type("DemoProject")
            cy.wrap($body).find('#react-select-7-listbox').first().click();
            cy.wait(3000);
            cy.wrap($body).find('#react-select-9-input').clear().type("Tasks")
            cy.wrap($body).find('#react-select-9-listbox').first().click();
            cy.wait(2000);
            cy.wrap($body).contains('DEM-1').parents('tr').find('input[type="checkbox"]').click();
            cy.wrap($body).find('button').contains("OK").click();
            cy.wait(2000);
            cy.wrap($body).contains('solvedBy').parents('tr').find('input[type="checkbox"]').click();
            cy.wrap($body).contains('solvedBy').parents('tr').find('button.rs-btn-icon').click();
            cy.wrap($body).find('li.rs-dropdown-item').contains('Delete').click();
            cy.wrap($body).find('button').contains("Yes").click();
        })
        
    })
  })