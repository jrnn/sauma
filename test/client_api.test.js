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

  let invalidIds = [
    `${url}/all_your_base_are_belong_to_us`,
    `${url}/${new Client()._id}`
  ]

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
    await helper.initClients()

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

    test("returns nothing if not authed as admin", async () => {
      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body).toEqual([])
    })

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
          helper.newClient(),
          url,
          tokens.admin
        ))

    test("does not affect existing clients in DB", async () =>
      await tests
        .postDoesNotAffectExisting(
          api,
          Client,
          helper.newClient(),
          url,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      client = helper.newClient()

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
          [ helper.newClient() ],
          url,
          403,
          tokens.basic
        ))

    test("fails with invalid input", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Client,
          helper.invalidClients(),
          url,
          400,
          tokens.admin
        ))
  })

  describe(`PUT ${url}/:id`, async () => {

    beforeAll(async () => {
      client = helper.newClient()
      client.lastEditedBy = new Employee()._id
      client = await new Client(client).save()

      path = `${url}/${client.id}`
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Client,
          client,
          helper.updateClient(),
          path,
          tokens.admin
        ))

    test("does not affect any other clients in DB", async () =>
      await tests
        .putOnlyAffectsOne(
          api,
          Client,
          client,
          helper.updateClient(),
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let updates = helper.updateClient()

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
          [ helper.updateClient() ],
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateClient()

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
          helper.invalidClientUpdates(),
          path,
          400,
          tokens.admin
        ))
  })
})

afterAll(() => server.close())
