import LoginPage from '../../src/pages/index'
import StatisticsPage from '../../src/pages/statistics'
import RegisterPage from '../../src/pages/register'

// Register
// ========
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

describe('Mock registration', () => {
  it('Mock registration - button enabled with valid values', () => {
    cy.mount(<RegisterPage />)
    cy.get('button#register').then(() => {

      cy.get('input[id="email"]').type('Test@gmail.com')
      cy.get('input[id="password"]').type('Test123!')
      cy.get('input[id="confirm-password"]').type('Test123!')
      cy.get('input[id="first-name"]').type('Test')
      cy.get('input[id="last-name"]').type('UI')
      cy.get('#policy').check();

      cy.get('button#register').should('be.enabled')
    })
  })

  it('Mock registration - button disabled with invalid values', () => {
    cy.mount(<RegisterPage />)
    cy.get('button#register').then(() => {

      cy.get('input[id="email"]').type('Test@gmail.com')
      cy.get('input[id="password"]').type('Test123!')
      cy.get('input[id="confirm-password"]').type('Test123#')
      cy.get('input[id="first-name"]').type('Test')
      cy.get('input[id="last-name"]').type('UI')
      //cy.get('#policy').check();

      cy.get('button#register').should('be.disabled')
    })
  })
})


// Login
// =====
describe('Mock login', () => {
  it('Mock login - success', () => {
    cy.mount(<LoginPage />)
    cy.get('button#login').then(() => {
      cy.intercept('POST', 'http://localhost:8000/api/login/').as('loginRequest')

      cy.get('input[id="email"]').type('Admin@gmail.com')
      cy.get('input#auth-login-password').type('Admin123!')
      cy.get('button#login').click()

      cy.wait('@loginRequest').then(interception => {
        expect(interception.response.statusCode).to.equal(200)
      })
    })
  })

  it('Mock login - failure', () => {
    cy.mount(<LoginPage />)
    cy.get('button#login').then(() => {
      cy.intercept('POST', 'http://localhost:8000/api/login/').as('loginRequest')

      cy.get('input[id="email"]').type('Admin@gmail.com')
      cy.get('input#auth-login-password').type('Admin123!!!')
      cy.get('button#login').click()

      cy.wait('@loginRequest').then(interception => {
        expect(interception.response.statusCode).not.to.equal(200)
      })
    })
  })
})


// Forgot Password
// ===============
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


// Statistics
// ==========
describe('Navigate to statistics page', () => {
  it('Navigate to statistics page', () => {
    cy.mount(<LoginPage />)
    cy.get('input[id="email"]').type('Admin@gmail.com')
    cy.get('input#auth-login-password').type('Admin123!')
    cy.get('button#login')
      .click()
      .then(() => {
        cy.mount(<StatisticsPage />)
      })
  })
})
