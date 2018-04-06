const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)
const Employee = require("../model/employee")
const helper = require("./api_test_helper")
const tests = require("./standard_tests")
const url = "/api/employees"

if (process.env.NODE_ENV !== "test") {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Employee API", async () => {

  let employee
  let path
  let tokens

  beforeAll(async () => {
    await helper.initEmployees()
    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all employees in DB as JSON", async () =>
      await tests.getReturnsAllAsJSON(
        api, Employee, url, tokens.basic))

    test("fails if not authed, or if invalid token", async () =>
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .getFailsWithStatusCode(api, url, 401, token))))

    test("does not return password hashes", async () => {
      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)

      res.body.map(e =>
        expect(e.pwHash).toBeUndefined())
    })
  })

  describe(`GET ${url}/:id`, async () => {

    beforeAll(async () => {
      employee = await helper.randomEmployee()
      path = `${url}/${employee.id}`
    })

    test("with valid id returns that employee as JSON", async () =>
      await tests.getReturnsOneAsJSON(
        api, Employee, employee, path, tokens.basic))

    test("fails if not authed", async () =>
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .getFailsWithStatusCode(api, path, 401, token))))

    test("fails with invalid or nonexisting id", async () => {
      await tests.getFailsWithStatusCode(
        api, `${url}/${new Employee().id}`, 404, tokens.basic)

      await tests.getFailsWithStatusCode(
        api, `${url}/all_your_base_are_belong_to_us`, 400, tokens.basic)
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new employee as JSON", async () =>
      await tests.postReturnsNewAsJson(
        api, Employee, helper.newEmployee(), url, tokens.admin))

    test("fails if not authed as admin", async () => {
      let employees = [ helper.newEmployee() ]
      await Promise
        .all([ undefined, tokens.invalid, tokens.basic ]
          .map(token => tests
            .postFailsWithStatusCode(api, Employee, employees, url, 401, token)))
    })

    test("fails with invalid input", async () =>
      await tests.postFailsWithStatusCode(
        api, Employee, helper.invalidEmployees, url, 400, tokens.admin))
  })

  describe(`PUT ${url}/:id`, async () => {

    beforeAll(async () => {
      employee = await new Employee(helper.newEmployee()).save()
      path = `${url}/${employee.id}`
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests.putReturnsUpdatedAsJson(
        api, Employee, employee, helper.updateEmployee(), path, tokens.admin))

    test("succeeds also if authed as the employee in question", async () => {
      let token = helper.createToken(employee, process.env.SECRET)
      await tests.putReturnsUpdatedAsJson(
        api, Employee, employee, helper.updateEmployee(), path, token)
    })

    test("does not affect any other employees in DB", async () =>
      await tests.putOnlyAffectsOne(
        api, Employee, employee, helper.updateEmployee(), path, tokens.admin))

    test("fails if not authed as admin or employee in question", async () => {
      let updates = [ helper.updateEmployee() ]
      await Promise
        .all([ undefined, tokens.invalid, tokens.basic ]
          .map(token => tests
            .putFailsWithStatusCode(api, Employee, updates, path, 401, token)))
    })

    test("fails with invalid or nonexisting id", async () => {
      let updates = [ helper.updateEmployee() ]
      await Promise.all([
        `${url}/${new Employee().id}`,
        `${url}/all_your_base_are_belong_to_us`
      ].map(path => tests
        .putFailsWithStatusCode(
          api, Employee, updates, path, 400, tokens.admin))
      )})

    test("fails with invalid input", async () => {
      await tests.putFailsWithStatusCode(
        api, Employee, helper.invalidEmployeeUpdates, path, 400, tokens.admin)
    })
  })
})

afterAll(() => server.close())
