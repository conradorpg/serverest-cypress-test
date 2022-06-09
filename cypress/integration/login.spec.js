/// <reference types="cypress" />

describe('Testes com a API Serverest', () => {

  it('Login com sucesso', () => {
    cy.request({
      method: "POST",
      // url: "http://localhost:3000/login",
      url: "https://serverest.dev/",
      body: {
        "email": "fulano_silva@qa.com.br",
        "password": "teste"
      }
    }).then((Response) => {
      expect(Response.status).to.equal(200)
      expect(Response.body.message).to.equal('Login realizado com sucesso')
    })
  })
})