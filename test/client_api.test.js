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

  let adminId
  let client
  let path
  let tokens

  let invalidIds = [
    `${url}/all_your_base_are_belong_to_us`,
    `${url}/${new Client()._id}`
  ]

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
    await helper.initClients()

    let admin = await Employee
      .findOne({ username : "admin1" })

    adminId = admin._id
    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all clients in DB as JSON", async () =>
      await tests
        .getReturnsAllAsJSON(
          api,
          Client,
          url,
          tokens.admin
        ))

    test("fails if invalid token", async () =>
      await Promise
        .all(tokens.invalid
          .map(token => tests
            .getFailsWithStatusCode(
              api,
              url,
              401,
              token
            ))))

    test("fails if not authed as admin", async () =>
      await tests
        .getFailsWithStatusCode(
          api,
          url,
          403,
          tokens.basic
        ))
  })

  describe(`GET ${url}/:id`, async () => {

    beforeAll(async () => {
      client = await helper.randomClient()
      path = `${url}/${client.id}`
    })

    test("with valid id returns that client as JSON", async () =>
      await tests
        .getReturnsOneAsJSON(
          api,
          Client,
          client,
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () =>
      await Promise
        .all(tokens.invalid
          .map(token => tests
            .getFailsWithStatusCode(
              api,
              path,
              401,
              token
            ))))

    test("fails if not authed as admin", async () =>
      await tests
        .getFailsWithStatusCode(
          api,
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () =>
      await Promise
        .all(invalidIds
          .map(id => tests
            .getFailsWithStatusCode(
              api,
              id,
              404,
              tokens.admin
            ))))
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new client as JSON", async () =>
      await tests
        .postReturnsNewAsJson(
          api,
          Client,
          helper.newClient(adminId),
          url,
          tokens.admin
        ))

    test("does not affect existing clients in DB", async () =>
      await tests
        .postDoesNotAffectExisting(
          api,
          Client,
          helper.newClient(adminId),
          url,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      client = helper.newClient(adminId)

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .postFailsWithStatusCode(
              api,
              Client,
              [ client ],
              url,
              401,
              token
            )))
    })

    test("fails if not authed as admin", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Client,
          [ helper.newClient(adminId) ],
          url,
          403,
          tokens.basic
        ))

    test("fails with invalid input", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Client,
          helper.invalidClients(adminId),
          url,
          400,
          tokens.admin
        ))
  })

  describe(`PUT ${url}/:id`, async () => {

    beforeAll(async () => {
      client = await new Client(
        helper.newClient(adminId)).save()

      path = `${url}/${client.id}`
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Client,
          client,
          helper.updateClient(adminId),
          path,
          tokens.admin
        ))

    test("does not affect any other clients in DB", async () =>
      await tests
        .putOnlyAffectsOne(
          api,
          Client,
          client,
          helper.updateClient(adminId),
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let updates = helper.updateClient(adminId)

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .putFailsWithStatusCode(
              api,
              Client,
              [ updates ],
              path,
              401,
              token
            )))
    })

    test("fails if not authed as admin", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Client,
          [ helper.updateClient(adminId) ],
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateClient(adminId)

      await Promise
        .all(invalidIds
          .map(id => tests
            .putFailsWithStatusCode(
              api,
              Client,
              [ updates ],
              id,
              404,
              tokens.admin
            )))
    })

    test("fails with invalid input", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Client,
          helper.invalidClientUpdates(adminId),
          path,
          400,
          tokens.admin
        ))
  })
})

afterAll(() => server.close())
