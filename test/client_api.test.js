const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)
const Client = require("../model/client")
const helper = require("../test/api_test_helper")
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

    test("returns clients in DB as JSON", async () => {
      let clientsInDb = await Client.find()

      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.admin}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      let legalEntities = res.body.map(c => c.legalEntity)
      let contactPersons = res.body.map(c => c.contactPerson)
      let businessIds = res.body.map(c => c.businessId)

      clientsInDb.forEach(c => {
        expect(legalEntities).toContain(c.legalEntity)
        expect(contactPersons).toContain(c.contactPerson)
        expect(businessIds).toContain(c.businessId)
      })
      expect(res.body.length).toBe(clientsInDb.length)
    })

    test("fails if not authenticated as admin, or if invalid token", async () => {
      await api
        .get(url)
        .expect(401)

      await api
        .get(url)
        .set("authorization", `bearer ${tokens.invalid}`)
        .expect(401)

      await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)
        .expect(401)
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new client as JSON", async () => {
      let clientsBefore = await Client.find()
      let client = helper.newClient()

      let res = await api
        .post(url)
        .set("authorization", `bearer ${tokens.admin}`)
        .send(client)
        .expect(201)
        .expect("content-type", /application\/json/)

      let clientsAfter = await Client.find()
      expect(clientsAfter.length).toBe(clientsBefore.length + 1)

      expect(res.body.legalEntity).toEqual(client.legalEntity)
      expect(res.body.contactPerson).toEqual(client.contactPerson)
      expect(res.body.businessId).toEqual(client.businessId)
    })

    test("fails if not authenticated as admin", async () => {
      let clientsBefore = await Client.find()
      let client = helper.newClient()

      await api
        .post(url)
        .set("authorization", `bearer ${tokens.basic}`)
        .send(client)
        .expect(401)

      let clientsAfter = await Client.find()
      expect(clientsAfter.length).toBe(clientsBefore.length)
    })

    test("fails with invalid input", async () => {
      let clientsBefore = await Client.find()

      await Promise
        .all(helper.invalidClients
          .map(c => api
            .post(url)
            .set("authorization", `bearer ${tokens.admin}`)
            .send(c)
            .expect(400)
          ))

      let clientsAfter = await Client.find()
      expect(clientsAfter.length).toBe(clientsBefore.length)
    })
  })
})

afterAll(() => server.close())
