// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// -- Meus comandos --
Cypress.Commands.add('token', (email, password) => {
  cy.request({
    method: "POST",
    url: "/login",
    body: {
      "email": email,
      "password": password
    }
  }).then((Response) => {
    expect(Response.status).to.equal(200)
    return Response.body.authorization
  })
});

Cypress.Commands.add('productId', () => {
  cy.request({
    method: "GET",
    url: "/produtos",
  }).then((Response) => {
    expect(Response.status).to.equal(200)
    return Response.body.produtos[2]._id
  })
})

Cypress.Commands.add('userId', () => {
  cy.request({
    method: "GET",
    url: "/usuarios",
  }).then((Response) => {
    expect(Response.status).to.equal(200)
    return Response.body.usuarios[2]._id
  })
});

Cypress.Commands.add('cadastrarProduto', (token, nome, preco, descricao, quantidade) => {
  cy.request({
    method: "POST",
    url: "/produtos",
    headers: { authorization: token },
    body: {
      "nome": nome,
      "preco": preco,
      "descricao": descricao,
      "quantidade": quantidade
    },
    failOnStatusCode: false
  })
});

Cypress.Commands.add('cadastrarUsuario', (token, nome, email, password, administrador) => {
  cy.request({
    method: "POST",
    url: "/usuarios",
    headers: { authorization: token },
    body: {
      "nome": nome,
      "email": email,
      "password": password,
      "administrador": administrador
    }
  })
});