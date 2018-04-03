const supertest = require("supertest")
const { app, server } = require("../index")
const jwt = require("jsonwebtoken")
const api = supertest(app)
const Employee = require("../model/employee")
const helper = require("../test/api_test_helper")
const url = "/api/login"

if (process.env.NODE_ENV !== "test") {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Login API", async () => {

  beforeEach(async () => {
    await Employee.remove()
    let employees = helper.initEmployees.map(e => new Employee(e))
    await Promise.all(employees.map(e => e.save()))
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid credentials, and returns token as JSON with correct data", async () => {
      let username = (Math.random() < 0.5)
        ? "spongebob"
        : "cnorris"

      let employee = await Employee.findOne({ username })
      let res = await api
        .post(url)
        .send({ username, password : "Qwerty_123" })
        .expect(200)
        .expect("content-type", /application\/json/)

      let token = jwt.verify(res.body.token, process.env.SECRET)

      expect(employee._id.toString()).toEqual(token.id.toString())
      expect(employee.firstName).toEqual(token.firstName)
      expect(employee.administrator).toEqual(token.admin)
    })

    test("fails with valid credentials, if account is disabled", async () => {
      let username = "boaty1"
      let employee = await Employee.findOne({ username })

      await api
        .post(url)
        .send({ username, password : "Qwerty_123" })
        .expect(401)

      expect(employee.enabled).toBe(false)
    })

    test("fails with invalid credentials", async () => {
      await Promise
        .all(helper.invalidCredentials
          .map(c => api
            .post(url)
            .send(c)
            .expect(401)
          ))
    })
  })
})

afterAll(() => server.close())
