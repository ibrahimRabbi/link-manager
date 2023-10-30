describe('The Admin Dashboard test', () => {
  beforeEach(()=>{
      cy.login('mario','admin')
  })
  it('Admin Dashboard Integrations',()=>{
    cy.get('[data-cy="profile-options-btn"]').click();
    cy.get('[data-cy="profile-btns"]').contains("Admin Dashboard").click();
    cy.get('.admin-side-nav-body').find('ul a.rs-sidenav-item').eq(2).click();
    cy.get('h3').should('contain', 'Integrations');
    cy.get('button').contains("Add New").click();
    cy.wait(1000);
    cy.get(':nth-child(1) > .rs-form-group > .rs-form-control > .css-b62m3t-container > .css-13cymwt-control > .css-art2ul-ValueContainer2').click();
    cy.get('#react-select-3-input').clear().type("test org")
    cy.get('#react-select-3-listbox').first().click();
    cy.wait(1000);
    cy.get(':nth-child(2) > .rs-form-group > .rs-form-control > .css-b62m3t-container > .css-13cymwt-control > .css-art2ul-ValueContainer2').click();
    cy.get('#react-select-5-input').clear().type("Valispace")
    cy.get('#react-select-5-listbox').first().click();
    cy.wait(1000);
    cy.get('#name-4').clear().type('Cypress Testing');
    cy.get('#server_url-4').clear().type('https://koneksys.valispace.com');
    cy.get('#description-4').clear().type('Cypress Testing the integration of test org')
    cy.get('button').contains("Save").click();
    cy.get('.rs-message-body').should('contain','successfully registered');
    cy.wait(1000);
    cy.get('#username-4').clear().type('axel.reichwein@koneksys.com');
    cy.get('#password-4').clear().type(`${'temp4now2023!'}{enter}`, { log: false });
    cy.wait(3000);
    cy.get('._step2Container_kdu7x_12 > h4').should('contain','You have authorized')
    cy.get('button').contains("Close").click();
    cy.get('[aria-label="2"]').click();
    cy.get('.rs-table-row').should('contain','Cypress Testing');
    cy.contains('Cypress Testing').parents('.rs-table-row').find('button[title="Edit"]').click();
    cy.get('#name-4').type(' 2');
    cy.get('#server_url-4').clear().type('https://koneksys.valispace.com');
    cy.get('#description-4').type(' with valispace.');
    cy.get('button').contains("Save").click();
    cy.get('button').contains("Skip").click();
    cy.get('._step2Container_kdu7x_12 > h4').should('contain','You have not authorized')
    cy.get('button').contains("Close").click();
    cy.wait(1000);
    cy.get('.rs-message-error').should('not.exist')
    cy.get('[aria-label="2"]').click()
    cy.wait(1000);
    cy.contains('Cypress Testing 2').parents('.rs-table-row').find('button[title="Delete"]').click();
    cy.get('button').contains("Yes").click();
    cy.get('.rs-message-container').should('contain','The content was successfully deleted');
  })
})