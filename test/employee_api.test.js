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

      let res = await api
        .get(url)
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
      let res = await api.get(url)
      let pwHashes = res.body.map(e => e.pwHash)

      pwHashes.forEach(pwHash =>
        expect(pwHash).toEqual(undefined))
    })
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new employee as JSON", async () => {
      let employeesBefore = await Employee.find()
      let employee = helper.newEmployee()

      let res = await api
        .post(url)
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
      // TO BE IMPLEMENTED
      expect(1).toBe(1)
    })

    test("fails with invalid input", async () => {
      let employeesBefore = await Employee.find()

      await Promise
        .all(helper.invalidEmployees.map(e => {
          return api
            .post(url)
            .send(e)
            .expect(400)
        }))

      let employeesAfter = await Employee.find()
      expect(employeesAfter.length).toBe(employeesBefore.length)
    })
  })
})

afterAll(() => server.close())
