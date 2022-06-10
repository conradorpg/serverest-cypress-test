/// <reference types="cypress" />

describe('Testes com a API Serverest', () => {

  it('Login com sucesso', () => {
    cy.request('/usuarios').then(Response => {
      let email = Response.body.usuarios[0].email
      let password = Response.body.usuarios[0].password
    cy.request({
      method: "POST",
      // url: "http://localhost:3000/login",
      url: "https://serverest.dev/login",
      body: {
        "email": email,
        "password": password
      }
    })
    }).then((Response) => {
      expect(Response.status).to.equal(200)
      expect(Response.body.message).to.equal('Login realizado com sucesso')
    })
  })
})