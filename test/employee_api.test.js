const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)
const Employee = require("../model/employee")
const helper = require("../test/api_test_helper")
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

    test("returns employees in DB as JSON", async () => {
      let employeesInDb = await Employee.find()

      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      let usernames = res.body.map(e => e.username)
      let lastNames = res.body.map(e => e.lastName)
      let emails = res.body.map(e => e.email)

      employeesInDb.forEach(e => {
        expect(usernames).toContain(e.username)
        expect(lastNames).toContain(e.lastName)
        expect(emails).toContain(e.email)
      })
      expect(res.body.length).toBe(employeesInDb.length)
    })

    test("does not return password hashes", async () => {
      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)

      res.body.map(e => expect(e.pwHash).toEqual(undefined))
    })

    test("fails if not authenticated or if invalid token", async () => {
      await api
        .get(url)
        .expect(401)

      await api
        .get(url)
        .set("authorization", `bearer ${tokens.invalid}`)
        .expect(401)
    })
  })

  describe(`GET ${url}/:id`, async () => {

    let employee
    beforeAll(async () => employee = await helper.randomEmployee())

    test("with valid id returns that employee as JSON", async () => {
      let res = await api
        .get(`${url}/${employee._id}`)
        .set("authorization", `bearer ${tokens.basic}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body.username).toEqual(employee.username)
      expect(res.body.lastName).toEqual(employee.lastName)
      expect(res.body.email).toEqual(employee.email)
    })

    test("fails if not authenticated or if invalid token", async () => {
      await api
        .get(`${url}/${employee.id}`)
        .expect(401)

      await api
        .get(`${url}/${employee.id}`)
        .set("authorization", `bearer ${tokens.invalid}`)
        .expect(401)
    })

    test("fails with invalid or nonexisting id", async () => {
      await api
        .get(`${url}/${new Employee()._id}`)
        .set("authorization", `bearer ${tokens.basic}`)
        .expect(404)

      await api
        .get(`${url}/all_your_base_are_belong_to_us`)
        .set("authorization", `bearer ${tokens.basic}`)
        .expect(400)
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new employee as JSON", async () => {
      let employeesBefore = await Employee.find()
      let employee = helper.newEmployee()

      let res = await api
        .post(url)
        .set("authorization", `bearer ${tokens.admin}`)
        .send(employee)
        .expect(201)
        .expect("content-type", /application\/json/)

      let employeesAfter = await Employee.find()
      expect(employeesAfter.length).toBe(employeesBefore.length + 1)

      expect(res.body.username).toEqual(employee.username)
      expect(res.body.lastName).toEqual(employee.lastName)
      expect(res.body.email).toEqual(employee.email)
    })

    test("fails if not authenticated as admin", async () => {
      let employeesBefore = await Employee.find()
      let employee = helper.newEmployee()

      await api
        .post(url)
        .set("authorization", `bearer ${tokens.basic}`)
        .send(employee)
        .expect(401)

      let employeesAfter = await Employee.find()
      expect(employeesAfter.length).toBe(employeesBefore.length)
    })

    test("fails with invalid input", async () => {
      let employeesBefore = await Employee.find()

      await Promise
        .all(helper.invalidEmployees
          .map(e => api
            .post(url)
            .set("authorization", `bearer ${tokens.admin}`)
            .send(e)
            .expect(400)
          ))

      let employeesAfter = await Employee.find()
      expect(employeesAfter.length).toBe(employeesBefore.length)
    })
  })
})

afterAll(() => server.close())