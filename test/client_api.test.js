const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)
const Client = require("../model/client")
const helper = require("./api_test_helper")
const standardTests = require("./standard_tests")
const url = "/api/clients"

if (process.env.NODE_ENV !== "test") {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Client API", async () => {

  let tokens

  beforeAll(async () => {
    await helper.initEmployees()
    await helper.initClients()
    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all clients in DB as JSON", async () =>
      await standardTests
        .getReturnsAllAsJSON(api, Client, url, tokens.admin))

    test("fails if not authed as admin, or if invalid token", async () =>
      await Promise
        .all([ undefined, tokens.invalid, tokens.basic ]
          .map(token => standardTests
            .getReturnsStatusCode(api, url, 401, token))))
  })

  describe(`GET ${url}/:id`, async () => {

    let client
    beforeAll(async () =>
      client = await helper.randomClient())

    test("with valid id returns that client as JSON", async () =>
      await standardTests
        .getReturnsOneAsJSON(api, Client, client, url, tokens.admin))

    test("fails if not authed as admin", async () =>
      await Promise
        .all([ undefined, tokens.invalid, tokens.basic ]
          .map(token => standardTests
            .getReturnsStatusCode(api, `${url}/${client.id}`, 401, token))))

    test("fails with invalid or nonexisting id", async () => {
      let invalidPath = `${url}/${new Client().id}`
      await standardTests
        .getReturnsStatusCode(api, invalidPath, 404, tokens.admin)

      invalidPath = `${url}/all_your_base_are_belong_to_us`
      await standardTests
        .getReturnsStatusCode(api, invalidPath, 400, tokens.admin)
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new client as JSON", async () =>
      await standardTests.postReturnsNewAsJson(
        api, Client, helper.newClient(), url, tokens.admin))

    test("fails if not authed as admin", async () => {
      let clients = [ helper.newClient() ]
      await Promise
        .all([ undefined, tokens.invalid, tokens.basic ]
          .map(token => standardTests
            .postFailsWithStatusCode(api, Client, clients, url, 401, token)))
    })

    test("fails with invalid input", async () =>
      await standardTests.postFailsWithStatusCode(
        api, Client, helper.invalidClients, url, 400, tokens.admin))
  })
})

afterAll(() => server.close())
