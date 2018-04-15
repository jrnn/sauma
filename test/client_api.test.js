const { app, server } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

const Client = require("../model/client")
const Employee = require("../model/employee")
const helper = require("./api_test_helper")
const tests = require("./standard_tests")
const url = "/api/clients"

if ( process.env.NODE_ENV !== "test" ) {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Client API", async () => {

  let client
  let path
  let tokens
  let userId

  let invalidId = `${url}/all_your_base_are_belong_to_us`
  let nonExistingId = `${url}/${new Client()._id}`

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
    await helper.initClients()

    let user = await Employee.findOne({ username : "admin_user" })
    userId = user._id

    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all clients in DB as JSON", async () =>
      await tests.getReturnsAllAsJSON(
        api, Client, url, tokens.admin))

    test("fails if not authed as admin, or if invalid token", async () => {
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .getFailsWithStatusCode(api, url, 401, token)))

      await tests.getFailsWithStatusCode(
        api, url, 403, tokens.basic)
    })
  })

  describe(`GET ${url}/:id`, async () => {

    beforeAll(async () => {
      client = await helper.randomClient()
      path = `${url}/${client.id}`
    })

    test("with valid id returns that client as JSON", async () =>
      await tests.getReturnsOneAsJSON(
        api, Client, client, path, tokens.admin))

    test("fails if not authed as admin", async () => {
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .getFailsWithStatusCode(api, path, 401, token)))

      await tests.getFailsWithStatusCode(
        api, path, 403, tokens.basic)
    })

    test("fails with invalid or nonexisting id", async () => {
      await tests.getFailsWithStatusCode(
        api, nonExistingId, 404, tokens.admin)

      await tests.getFailsWithStatusCode(
        api, invalidId, 400, tokens.admin)
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new client as JSON", async () =>
      await tests.postReturnsNewAsJson(
        api, Client, helper.newClient(userId), url, tokens.admin))

    test("does not affect existing clients in DB", async () =>
      await tests.postDoesNotAffectExisting(
        api, Client, helper.newClient(userId), url, tokens.admin))

    test("fails if not authed as admin", async () => {
      client = [ helper.newClient(userId) ]
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .postFailsWithStatusCode(api, Client, client, url, 401, token)))

      await tests.postFailsWithStatusCode(
        api, Client, client, url, 403, tokens.basic)
    })

    test("fails with invalid input", async () =>
      await tests.postFailsWithStatusCode(
        api, Client, helper.invalidClients(userId), url, 400, tokens.admin))
  })

  describe(`PUT ${url}/:id`, async () => {

    beforeAll(async () => {
      client = await new Client(helper.newClient(userId)).save()
      path = `${url}/${client.id}`
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests.putReturnsUpdatedAsJson(
        api, Client, client, helper.updateClient(userId), path, tokens.admin))

    test("does not affect any other clients in DB", async () =>
      await tests.putOnlyAffectsOne(
        api, Client, client, helper.updateClient(userId), path, tokens.admin))

    test("fails if not authed as admin", async () => {
      let updates = [ helper.updateClient(userId) ]
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .putFailsWithStatusCode(api, Client, updates, path, 401, token)))

      await tests.putFailsWithStatusCode(
        api, Client, updates, path, 403, tokens.basic)
    })

    test("fails with invalid or nonexisting id", async () => {
      let updates = [ helper.updateClient(userId) ]

      await tests.putFailsWithStatusCode(
        api, Client, updates, nonExistingId, 404, tokens.admin)

      await tests.putFailsWithStatusCode(
        api, Client, updates, invalidId, 400, tokens.admin)
    })

    test("fails with invalid input", async () =>
      await tests.putFailsWithStatusCode(
        api, Client, helper.invalidClientUpdates(userId), path, 400, tokens.admin))
  })
})

afterAll(() => server.close())
