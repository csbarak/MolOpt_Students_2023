// Pages
import LoginPage from '../../src/pages/index'
import StatisticsPage from '../../src/pages/statistics'
import RegisterPage from '../../src/pages/register'
import ContactAdminPage from '../../src/pages/contact'
import AccountSettingsPage from '../../src/pages/account-settings'

// // Components
// import FileUpload from '../../src/components/file-upload'


// ########################################################################
// ############################    Tests     ##############################
// ########################################################################


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


// Contact Admin
// =============
describe('Mock contact admin', () => {
  it('Mock contact admin', () => {
    cy.mount(<LoginPage />)
    cy.get('button#login').then(() => {
      cy.intercept('POST', 'http://localhost:8000/api/login/').as('loginRequest')

      cy.get('input[id="email"]').type('User@gmail.com')
      cy.get('input#auth-login-password').type('User123!')
      cy.get('button#login').click()

      cy.wait('@loginRequest').then(interception => {
        expect(interception.response.statusCode).to.equal(200)
      })
    })
    .then(() => {
      cy.mount(<ContactAdminPage />)
      cy.get('div[id="select-contact"]').click()
      cy.contains('Suggestion').click()
      cy.get('textarea[id="message"]').type('UI Tests suggestion')

      cy.get('button[type="submit"]#contact-button').should('be.enabled')
    })
  })
})

// Edit User Profile
// =================
describe('Mock edit user profile', () => {
  it('Mock edit user profile', () => {
  cy.mount(<LoginPage />)
  cy.get('button#login').then(() => {
    cy.intercept('POST', 'http://localhost:8000/api/login/').as('loginRequest')

    cy.get('input[id="email"]').type('User@gmail.com')
    cy.get('input#auth-login-password').type('User123!')
    cy.get('button#login').click()

    cy.wait('@loginRequest').then(interception => {
      expect(interception.response.statusCode).to.equal(200)
    })
  })
  .then(() => {
    cy.mount(<AccountSettingsPage />)
    cy.get('input#affiliation').type(' TEST')   // Adding ' TEST' to the input text
    cy.get('input#position').type(' TEST')    //Adding ' TEST' to the input text
    
    cy.get('button#submit-changes').should('be.enabled')
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
    cy.get('button#login').click()
      .then(() => {
        cy.mount(<StatisticsPage />)
      })
  })
})

// // Run Algorithms
// // ==============
// describe('Mock run algorithms', () => {
//   it('Mock run algorithms', () => {
//     cy.mount(<LoginPage />)
//     cy.get('input[id="email"]').type('Admin@gmail.com')
//     cy.get('input#auth-login-password').type('Admin123!')
//     cy.get('button#login').click()

//     cy.mount(<RunAlgorithmsPage />)
//     cy.fixture('file1.csv').then(fileContent => {
//       cy.get('input#file1').attachFile({
//         fileContent,
//         fileName: 'file1.csv',
//         mimeType: 'text/csv',
//       })
//     })
//     cy.fixture('file2.csv').then(fileContent => {
//       cy.get('input#file2').attachFile({
//         fileContent,
//         fileName: 'file2.csv',
//         mimeType: 'text/csv',
//       })
//     })
//     cy.get('button#submit').should('be.enabled')
//   })
  
//   it('Upload invalid files and disable submit button', () => {
//     cy.mount(<RunAlgorithmsPage />)
//     // Upload invalid files or skip uploading files
//     cy.get('button#submit').should('be.disabled')
//   })
// })
