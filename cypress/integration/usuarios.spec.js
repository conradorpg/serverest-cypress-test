/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Testes com a API Serverest - Usuarios', () => {
  let token
  let userId

  before(() => {
    cy.token(
      'fulano_silva@qa.com.br', 'teste')
      .then(key => { token = key })
    
      cy.userId()
      .then(code => { userId = code})
  })

  it('Buscar usuários', () => {
    cy.request({
      method: "GET",
      url: "/usuarios",
      body: {}
    }).then((Response) => {
      cy.log(Response.body.usuarios[2])
      expect(Response.status).to.equal(200)
    })
  });

  it('Cadastrar usuário', () => {
    cy.request({
      method: "POST",
      url: "/usuarios",
      headers: { authorization: token },
      body: {
        "nome": faker.name.firstName(),
        "email": faker.internet.email(),
        "password": "teste",
        "administrador": "true"
      }
    }).then((Response) => {
      expect(Response.status).to.equal(201)
    })
  });

  it('Buscar usuários por id', () => {
    cy.request({
      method: "GET",
      url: `/usuarios/${userId}`,
      body: {}
    }).then((Response) => {
      expect(Response.status).to.equal(200)
    })
  });

  it('Excluir usuários', () => {
    cy.request({
      method: "DELETE",
      url: `/usuarios/${userId}`,
      headers: { authorization: token },
      body: {}
    }).then((Response) => {
      expect(Response.status).to.equal(200)
    })
  });

  it('Editar usuários', () => {
    cy.request({
      method: "PUT",
      url: `/usuarios/${userId}`,
      headers: { authorization: token },
      body: {
        "nome": faker.name.firstName(),
        "email": faker.internet.email(),
        "password": "teste",
        "administrador": "true"
      },
    }).then((Response) => {
      expect(Response.status).to.equal(201)
    })
  })

})