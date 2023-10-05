describe('Valispace Website Visit', () => {
    beforeEach(()=>{
        cy.login('mario','admin')
    })
    it('Valispace Tracelynx test',()=>{
        cy.origin('https://koneksys.valispace.com', ()=>{
            cy.visit('/login;next=%2F')
            cy.get('input[data-test="input-username"]').type('axel.reichwein@koneksys.com')
            cy.get('input[data-test="input-password"]').type(`${'temp4now2023!'}{enter}`, { log: false });
        })
    })
  })