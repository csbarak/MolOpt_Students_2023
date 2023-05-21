import LoginPage from '../../src/pages/index'

describe('Mock login', () => {
  it('Mock login', () => {
    cy.mount(<LoginPage />)
    cy.get('button#login').then(() => {
      cy.intercept('POST', 'http://localhost:8000/api/login/').as('loginRequest')

      cy.get('input[id="email"]').type('Admin@gmail.com')
      cy.get('input#auth-login-password').type('Admin123!')
      cy.get('button#login').click()

      cy.wait('@loginRequest').then(interception => {
        expect(interception.response.statusCode).to.equal(200) // Verify the status code
      })
    })
  })
})

describe('Mock forgot password', () => {
  it('Mock forgot password', () => {
    cy.mount(<LoginPage />)
    cy.get('button#forgot_password')
      .click()
      .then(() => {
        cy.get('div#forgot_password_modal').should('be.visible')
      })
  })
})

describe('Navigate to register page', () => {
  it('Navigate to register page', () => {
    cy.mount(<LoginPage />)
    cy.get('a#new_account')
      .invoke('attr', 'href')
      .then(href => {
        expect(href).to.contain('/register')
      })
  })
})
