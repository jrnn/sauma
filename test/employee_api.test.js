const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)
const Employee = require("../model/employee")
const helper = require("./api_test_helper")
const standardTests = require("./standard_tests")
const url = "/api/employees"

if (process.env.NODE_ENV !== "test") {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Employee API", async () => {

  let tokens

  beforeAll(async () => {
    await helper.initEmployees()
    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all employees in DB as JSON", async () =>
      await standardTests
        .getReturnsAllAsJSON(api, Employee, url, tokens.basic))

    test("fails if not authed or if invalid token", async () =>
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => standardTests
            .getReturnsStatusCode(api, url, 401, token))))

    test("does not return password hashes", async () => {
      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)

      res.body.map(e =>
        expect(e.pwHash).toEqual(undefined))
    })
  })

  describe(`GET ${url}/:id`, async () => {

    let employee
    beforeAll(async () =>
      employee = await helper.randomEmployee())

    test("with valid id returns that employee as JSON", async () =>
      await standardTests
        .getReturnsOneAsJSON(api, Employee, employee, url, tokens.basic))

    test("fails if not authed", async () =>
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => standardTests
            .getReturnsStatusCode(api, `${url}/${employee.id}`, 401, token))))

    test("fails with invalid or nonexisting id", async () => {
      let invalidPath = `${url}/${new Employee().id}`
      await standardTests
        .getReturnsStatusCode(api, invalidPath, 404, tokens.basic)

      invalidPath = `${url}/all_your_base_are_belong_to_us`
      await standardTests
        .getReturnsStatusCode(api, invalidPath, 400, tokens.basic)
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new employee as JSON", async () =>
      await standardTests.postReturnsNewAsJson(
        api, Employee, helper.newEmployee(), url, tokens.admin))

    test("fails if not authed as admin", async () => {
      let employees = [ helper.newEmployee() ]
      await Promise
        .all([ undefined, tokens.invalid, tokens.basic ]
          .map(token => standardTests
            .postFailsWithStatusCode(api, Employee, employees, url, 401, token)))
    })

    test("fails with invalid input", async () =>
      await standardTests.postFailsWithStatusCode(
        api, Employee, helper.invalidEmployees, url, 400, tokens.admin))
  })
})

afterAll(() => server.close())
