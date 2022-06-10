/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import contrato from '../contracts/usuarios.contracts'

describe('Testes com a API Serverest - Usuarios', () => {
  let token
  let userId

  before(() => {
    cy.request('/usuarios').then(Response => {
      let email = Response.body.usuarios[0].email
      let password = Response.body.usuarios[0].password

    cy.token(email, password)
      .then(key => { token = key })

    cy.userId()
      .then(code => { userId = code })
    })
  });

  it('Validar contrato de usuários', () => {
    cy.request('/usuarios').then(Response => {
      return contrato.validateAsync(Response.body)
    })
  });

  it('Buscar usuários', () => {
    cy.request({
      method: "GET",
      url: "/usuarios",
    }).then((Response) => {
      cy.log(Response.body.usuarios[2])
      expect(Response.status).to.equal(200)
    })
  });

  it('Cadastrar usuário com sucesso', () => {
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

  it('Validar usuário com email inválido', () => {
    cy.request({
      method: "POST",
      url: "/usuarios",
      headers: { authorization: token },
      body: {
        "nome": faker.name.firstName(),
        "email": 'invalid@mail',
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
    }).then((Response) => {
      expect(Response.status).to.equal(400)
      expect(Response.body.email).to.equal('email deve ser um email válido')
    })
  });

  it('Buscar usuários por id', () => {
    cy.request({
      method: "GET",
      url: `/usuarios/${userId}`,
    }).then((Response) => {
      expect(Response.status).to.equal(200)
    })
  });

  it('Excluir usuários', () => {
    cy.request({
      method: "DELETE",
      url: `/usuarios/${userId}`,
      headers: { authorization: token },
    }).then((Response) => {
      expect(Response.status).to.equal(200)
    })
  });

  it('Excluir usuário previamente cadastrado', () => {
    let nome = faker.name.firstName()
    let email = faker.internet.email()
    cy.cadastrarUsuario(token, nome, email, 'teste', 'true')
      .then(Response => {
        let id = Response.body._id
        cy.request({
          method: "DELETE",
          url: `/usuarios/${userId}`,
          headers: { authorization: token },
          body: {}
        }).then((Response) => {
          expect(Response.status).to.equal(200)
        })
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
  });

  it('Editar usuários previamente cadastrado', () => {
    let nome = faker.name.firstName()
    let email = faker.internet.email()
    cy.cadastrarUsuario(token, nome, email, 'teste', 'true')
      .then(Response => {
        let id = Response.body._id
        cy.request({
          method: "PUT",
          url: `/usuarios/${id}`,
          headers: { authorization: token },
          body: {
            "nome": faker.name.firstName(),
            "email": faker.internet.email(),
            "password": "teste",
            "administrador": "true"
          },
        }).then(Response => {
          expect(Response.status).to.equal(200)
        })
      })
  })

})

