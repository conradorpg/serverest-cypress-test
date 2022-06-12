/// <reference types="cypress" />

import faker from "@faker-js/faker"
import contrato from '../contracts/produtos.contracts'

describe('Testes com a API Serverest - Produtos', () => {
  let token
  let productId

  before(() => {
    cy.request('/usuarios').then(Response => {
      let email = Response.body.usuarios[0].email
      let password = Response.body.usuarios[0].password
      
      cy.token(email, password)
      .then(key => { token = key })
      
      cy.productId()
      .then(code => { productId = code })
      
    })
  });

  it('Validar contrato de produtos', () => {
    cy.request('/produtos').then(Response => {
      return contrato.validateAsync(Response.body)
    })
  });

  it('Buscar produtos', () => {
    cy.request({
      method: "GET",
      url: "/produtos",
    }).then((Response) => {
      cy.log(Response.body.produtos[0].nome)
      expect(Response.status).to.equal(200)
      expect(Response.body).to.have.property('produtos')
      // expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Cadastrar produtos', () => {
    let num1 = Math.floor(Math.random() * 100)
    let num2 = Math.floor(Math.random() * 100)

    cy.request({
      method: "POST",
      url: "/produtos",
      headers: { authorization: token },
      body: {
        "nome": `Goldship Gamer X + ${num1} + ${num2}`,
        "preco": 160,
        "descricao": "Mouse",
        "quantidade": 250
      },
    }).then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      expect(Response.status).to.equal(201)
      // expect(Response.body).to.have.property('produtos')
      // expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Buscar produtos por id', () => {
    cy.request({
      method: "GET",
      url: `/produtos/${productId}`,
    }).then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      expect(Response.status).to.equal(200)
      // expect(Response.body).to.have.property('produtos')
      // expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Excluir produtos após seu cadastro', () => {
    let produto = faker.commerce.product()
    cy.cadastrarProduto(token, produto, 134, 'Mouse', 150)
      .then(Response => {
        let id = Response.body._id
        cy.request({
          method: "DELETE",
          url: `/produtos/${id}`,
          headers: { authorization: token },
          body: {},
        }).then((Response) => {
          // cy.log(Response.body.produtos[2].nome)
          expect(Response.status).to.equal(200)
          expect(Response.body.message).to.equal('Registro excluído com sucesso' || 'Nenhum registro excluído')
          // expect(Response.body).to.have.property('produtos')
          // expect(Response.duration).to.be.lessThan(30)
          // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
        })
      })
  });

  it('Editar produtos', () => {
    let num = Math.floor(Math.random() * 100000)

    cy.request({
      method: "PUT",
      url: `/produtos/${productId}`,
      headers: { authorization: token },
      body: {
        "nome": `Logitech MX Vertical + ${num}`,
        "preco": 470,
        "descricao": "Mouse",
        "quantidade": 381
      },
    }).then((Response) => {
      // cy.log(Response.body.produtos[2].nome)
      // expect(Response.status).to.equal(200)
      // expect(Response.body.message).to.equal('Registro alterado com sucesso')
      // expect(Response.body).to.have.property('produtos')
      // expect(Response.duration).to.be.lessThan(30)
      // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
    })
  });

  it('Outra forma de editar produtos', () => {
    let num = Math.floor(Math.random() * 100000)
    let produto = faker.commerce.product()
    let item = num + produto
    cy.request('/produtos').then(Response => {
      let id = Response.body.produtos[2]._id
      cy.request({
        method: 'PUT',
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          "nome": item,
          "preco": 323,
          "descricao": "Mouse",
          "quantidade": 424
        }
      }).then(Response => {
        // expect(Response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Cadastrar produto em seguida edita-lo', () => {
    let num = Math.floor(Math.random() * 100000)
    let produto = faker.commerce.product()
    let item = produto + num
    cy.cadastrarProduto(token, item, 134, 'Mouse', 150)
      .then(Response => {
        let id = Response.body._id
        cy.request({
          method: 'PUT',
          url: `/produtos/${id}`,
          headers: { authorization: token },
          body: {
            "nome": item,
            "preco": 350,
            "descricao": "Mouse",
            "quantidade": 350
          },
        }).then(Response => {
          expect(Response.body.message).to.equal('Registro alterado com sucesso')
        })
      })
  });

  // -- CENÁRIOS NEGATIVOS --

  it('Cadastrar produtos idêntico', () => {
    cy.request('/produtos').then(Response => {
      let nome = Response.body.produtos[0].nome
      let descricao = Response.body.produtos[0].descricao
    cy.cadastrarProduto(token, nome, 178, descricao, 250)
      .then((Response) => {
        // cy.log(Response.body.produtos[2].nome)
        expect(Response.status).to.equal(400)
          // expect(Response.body).to.have.property('produtos')
          // expect(Response.duration).to.be.lessThan(30)
        // expect(Response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
      })
    })
  });

})