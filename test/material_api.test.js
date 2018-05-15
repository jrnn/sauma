const { app, server } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

const Employee = require("../model/employee")
const helper = require("./api_test_helper")
const Material = require("../model/material")
const tests = require("./standard_tests")
const url = "/api/materials"

if ( process.env.NODE_ENV !== "test" ) {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Material API", async () => {

  let material
  let path
  let tokens

  let invalidIds = [
    `${url}/all_your_base_are_belong_to_us`,
    `${url}/${new Material()._id}`
  ]

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
    await helper.initMaterials()

    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all materials in DB as JSON", async () =>
      await tests
        .getReturnsAllAsJSON(
          api,
          Material,
          url,
          tokens.basic
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
  })

  describe(`GET ${url}/:id`, async () => {

    beforeAll(async () => {
      material = await helper.randomMaterial()
      path = `${url}/${material._id}`
    })

    test("with valid id returns that material as JSON", async () =>
      await tests
        .getReturnsOneAsJSON(
          api,
          Material,
          material,
          path,
          tokens.basic
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

    test("fails with invalid or nonexisting id", async () =>
      await Promise
        .all(invalidIds
          .map(id => tests
            .getFailsWithStatusCode(
              api,
              id,
              404,
              tokens.basic
            ))))
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new material as JSON", async () =>
      await tests
        .postReturnsNewAsJson(
          api,
          Material,
          helper.newMaterial(),
          url,
          tokens.admin
        ))

    test("does not affect existing materials in DB", async () =>
      await tests
        .postDoesNotAffectExisting(
          api,
          Material,
          helper.newMaterial(),
          url,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      material = helper.newMaterial()

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .postFailsWithStatusCode(
              api,
              Material,
              [ material ],
              url,
              401,
              token
            )))
    })

    test("fails if not authed as admin", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Material,
          [ helper.newMaterial() ],
          url,
          403,
          tokens.basic
        ))

    test("fails with invalid input", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Material,
          helper.invalidMaterials(),
          url,
          400,
          tokens.admin
        ))
  })

  describe(`PUT ${url}/:id`, async () => {

    beforeAll(async () => {
      material = helper.newMaterial()
      material.lastEditedBy = new Employee()._id
      material = await new Material(material).save()

      path = `${url}/${material._id}`
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Material,
          material,
          helper.updateMaterial(),
          path,
          tokens.admin
        ))

    test("does not affect any other materials in DB", async () =>
      await tests
        .putOnlyAffectsOne(
          api,
          Material,
          material,
          helper.updateMaterial(),
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let updates = helper.updateMaterial()

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .putFailsWithStatusCode(
              api,
              Material,
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
          Material,
          [ helper.updateMaterial() ],
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateMaterial()

      await Promise
        .all(invalidIds
          .map(id => tests
            .putFailsWithStatusCode(
              api,
              Material,
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
          Material,
          helper.invalidMaterialUpdates(),
          path,
          400,
          tokens.admin
        ))
  })
})

afterAll(() => server.close())
