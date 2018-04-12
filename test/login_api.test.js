const { app, server } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

const Employee = require("../model/employee")
const helper = require("../test/api_test_helper")
const jwt = require("jsonwebtoken")
const url = "/api/login"

if ( process.env.NODE_ENV !== "test" ) {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Login API", async () => {

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid credentials, and returns token as JSON with correct data", async () => {
      let username = (Math.random() < 0.5)
        ? "basic_user"
        : "admin_user"

      let employee = await Employee.findOne({ username })
      let res = await api
        .post(url)
        .send({ username, password : "Qwerty_123" })
        .expect(200)
        .expect("content-type", /application\/json/)

      let token = jwt.verify(res.body.token, process.env.SECRET)

      expect(employee.administrator).toEqual(res.body.admin)
      expect(employee.administrator).toEqual(token.admin)
      expect(employee.firstName).toEqual(res.body.firstName)
      expect(employee._id.toString()).toEqual(res.body.id.toString())
      expect(employee._id.toString()).toEqual(token.id.toString())
    })

    test("fails when account is disabled", async () => {
      let username = (Math.random() < 0.5)
        ? "basic_user"
        : "admin_user"

      await api
        .post(url)
        .send({ username, password : "Qwerty_123" })
        .expect(200)
        .expect("content-type", /application\/json/)

      await Employee.findOneAndUpdate({ username }, { enabled : false })
      await api
        .post(url)
        .send({ username, password : "Qwerty_123" })
        .expect(401)

      await Employee.findOneAndUpdate({ username }, { enabled : true })
      await api
        .post(url)
        .send({ username, password : "Qwerty_123" })
        .expect(200)
        .expect("content-type", /application\/json/)
    })

    test("fails with invalid credentials", async () =>
      await Promise
        .all(helper.invalidCredentials()
          .map(c => api
            .post(url)
            .send(c)
            .expect(401)
          )))
  })
})

afterAll(() => server.close())
