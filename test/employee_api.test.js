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

  beforeEach(async () => {
    await Employee.remove()
    let employees = helper.initEmployees.map(e => new Employee(e))
    await Promise.all(employees.map(e => e.save()))
  })

  describe(`GET ${url}`, async () => {

    test("returns employees in DB as JSON", async () => {
      let employeesInDb = await Employee.find()
      let user = await Employee.findOne({ username : "spongebob" })
      let token = helper.createToken(user, process.env.SECRET)

      let res = await api
        .get(url)
        .set("authorization", `bearer ${token}`)
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
      let user = await Employee.findOne({ username : "spongebob" })
      let token = helper.createToken(user, process.env.SECRET)

      let res = await api
        .get(url)
        .set("authorization", `bearer ${token}`)

      res.body.map(e => expect(e.pwHash).toEqual(undefined))
    })

    test("fails if not authenticated or if invalid token", async () => {
      await api
        .get(url)
        .expect(401)

      let user = await Employee.findOne({ username : "spongebob" })
      let token = helper.createToken(user, "incorrect_key")

      await api
        .get(url)
        .set("authorization", `bearer ${token}`)
        .expect(401)
    })
  })

  describe(`GET ${url}/:id`, async () => {

    test("with valid id returns that employee as JSON", async () => {
      let user = await Employee.findOne({ username : "spongebob" })
      let token = helper.createToken(user, process.env.SECRET)

      let employees = await Employee.find()
      let employee = employees[0]

      let res = await api
        .get(`${url}/${employee.id}`)
        .set("authorization", `bearer ${token}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body.username).toEqual(employee.username)
      expect(res.body.lastName).toEqual(employee.lastName)
      expect(res.body.email).toEqual(employee.email)
    })

    test("fails if not authenticated or if invalid token", async () => {
      let employees = await Employee.find()
      let employee = employees[0]

      await api
        .get(`${url}/${employee.id}`)
        .expect(401)

      let user = await Employee.findOne({ username : "spongebob" })
      let token = helper.createToken(user, "incorrect_key")

      await api
        .get(`${url}/${employee.id}`)
        .set("authorization", `bearer ${token}`)
        .expect(401)
    })

    test("fails with invalid or nonexisting id", async () => {
      let user = await Employee.findOne({ username : "spongebob" })
      let token = helper.createToken(user, process.env.SECRET)

      await api
        .get(`${url}/${new Employee()._id}`)
        .set("authorization", `bearer ${token}`)
        .expect(404)

      await api
        .get(`${url}/all_your_base_are_belong_to_us`)
        .set("authorization", `bearer ${token}`)
        .expect(400)
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new employee as JSON", async () => {
      let user = await Employee.findOne({ username : "cnorris" })
      let token = helper.createToken(user, process.env.SECRET)

      let employeesBefore = await Employee.find()
      let employee = helper.newEmployee()

      let res = await api
        .post(url)
        .set("authorization", `bearer ${token}`)
        .send(employee)
        .expect(201)
        .expect("content-type", /application\/json/)

      let employeesAfter = await Employee.find()
      expect(employeesAfter.length).toBe(employeesBefore.length + 1)

      expect(res.body.username).toEqual(employee.username)
      expect(res.body.lastName).toEqual(employee.lastName)
      expect(res.body.email).toEqual(employee.email)
    })

    test("fails if not authenticated as administrator", async () => {
      let user = await Employee.findOne({ username : "spongebob" })
      let token = helper.createToken(user, process.env.SECRET)

      let employeesBefore = await Employee.find()
      let employee = helper.newEmployee()

      await api
        .post(url)
        .set("authorization", `bearer ${token}`)
        .send(employee)
        .expect(401)

      let employeesAfter = await Employee.find()
      expect(employeesAfter.length).toBe(employeesBefore.length)
    })

    test("fails with invalid input", async () => {
      let user = await Employee.findOne({ username : "cnorris" })
      let token = helper.createToken(user, process.env.SECRET)
      let employeesBefore = await Employee.find()

      await Promise
        .all(helper.invalidEmployees.map(e => {
          return api
            .post(url)
            .set("authorization", `bearer ${token}`)
            .send(e)
            .expect(400)
        }))

      let employeesAfter = await Employee.find()
      expect(employeesAfter.length).toBe(employeesBefore.length)
    })
  })
})

afterAll(() => server.close())
