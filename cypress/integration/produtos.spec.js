/// <reference types="cypress" />

describe('Testes com a API Serverest - Produtos', () => {
  let token
  let productId

  before(() => {
    cy.token(
      'fulano_silva@qa.com.br', 'teste')
      .then(key => { token = key })

    cy.productId()
    .then(code => { productId = code})
  })

  it('Buscar produtos', () => {
    cy.request({
      method: "GET",
      url: "/produtos",
      body: {}
    }).then((Response) => {
      cy.log(Response.body.produtos[2].nome)
      expect(Response.status).to.equal(200)
      expect(Response.body).to.have.property('produtos')
      expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Cadastrar produtos', () => {
    let num = Math.floor(Math.random() * 100000)

    cy.request({
      method: "POST",
      url: "/produtos",
      headers: { authorization: token },
      body: {
        "nome": `Goldship Gamer X + ${num}`,
        "preco": 160,
        "descricao": "Mouse",
        "quantidade": 250
      },
    }).then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      expect(Response.status).to.equal(201)
      // expect(Response.body).to.have.property('produtos')
      expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Buscar produtos por id', () => {
    cy.request({
      method: "GET",
      url: `/produtos/${productId}`,
      body: {}
    }).then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      expect(Response.status).to.equal(200)
      // expect(Response.body).to.have.property('produtos')
      expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Excluir produtos', () => {
    cy.request({
      method: "DELETE",
      url: `/produtos/${productId}`,
      headers: { authorization: token },
      body: {},
    }).then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      expect(Response.status).to.equal(200)
      expect(Response.body.message).to.equal('Registro excluído com sucesso')
      // expect(Response.body).to.have.property('produtos')
      expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Editar produtos', () => {
    let num = Math.floor(Math.random() * 100000)

    cy.request({
      method: "PUT",
      url: `/produtos/${productId}`,
      body: {
        "nome": `Logitech MX Vertical + ${num}`,
        "preco": 470,
        "descricao": "Mouse",
        "quantidade": 381
      },
      headers: { authorization: token }
    }).then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      // expect(Response.status).to.equal(200)
      // expect(Response.body.message).to.equal('Registro alterado com sucesso')
      // expect(Response.body).to.have.property('produtos')
      expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  // -- CENÁRIOS NEGATIVOS --

  it.only('Cadastrar produtos idêntico', () => {
    cy.cadastrarProduto(token, 'Logitech MX Vertical', 178, 'Mouse', 250)
    .then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      expect(Response.status).to.equal(400),
      // expect(Response.body).to.have.property('produtos')
      expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

})