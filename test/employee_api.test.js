const { api } = require("./setup_tests")
const { checkPassword, createToken } = require("../util/auth")
const Employee = require("../model/employee")
const helper = require("./api_test_helper")
const tests = require("./standard_tests")
const url = "/api/employees"

describe("Employee API", () => {

  let employee
  let path
  let tokens

  let invalidIds = [
    `${url}/all_your_base_are_belong_to_us`,
    `${url}/${new Employee()._id}`
  ]

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()

    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, () => {

    test("returns all employees in DB as JSON", async () =>
      await tests
        .getReturnsAllAsJSON(
          api,
          Employee,
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

    test("does not return password hashes", async () => {
      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)

      res.body.map(e =>
        expect(e.pwHash).toBeUndefined())
    })
  })

  describe(`GET ${url}/:id`, () => {

    beforeAll(async () => {
      employee = await helper.randomEmployee()
      path = `${url}/${employee.id}`
    })

    test("with valid id returns that employee as JSON", async () =>
      await tests
        .getReturnsOneAsJSON(
          api,
          Employee,
          employee,
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

  describe(`POST ${url}`, () => {

    test("succeeds with valid input, and returns new employee as JSON", async () =>
      await tests
        .postReturnsNewAsJson(
          api,
          Employee,
          helper.newEmployee(),
          url,
          tokens.admin
        ))

    test("does not affect existing employees in DB", async () =>
      await tests
        .postDoesNotAffectExisting(
          api,
          Employee,
          helper.newEmployee(),
          url,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let employee = helper.newEmployee()

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .postFailsWithStatusCode(
              api,
              Employee,
              [ employee ],
              url,
              401,
              token
            )))
    })

    test("fails if not authed as admin", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Employee,
          [ helper.newEmployee() ],
          url,
          403,
          tokens.basic
        ))

    test("fails with invalid input", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Employee,
          helper.invalidEmployees(),
          url,
          400,
          tokens.admin
        ))
  })

  describe(`PUT ${url}/:id`, () => {

    let token

    beforeAll(async () => {
      employee = await new Employee(
        helper.newEmployee()).save()

      path = `${url}/${employee.id}`
      token = createToken(
        employee, process.env.SECRET, process.env.HANDSHAKE)
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Employee,
          employee,
          helper.updateEmployee(),
          path,
          tokens.admin
        ))

    test("succeeds also if authed as the employee in question", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Employee,
          employee,
          helper.updateEmployee(),
          path,
          token
        ))

    test("only admin can change 'admin' and 'enabled' fields", async () => {
      let updates = {
        administrator : !employee.administrator,
        enabled : !employee.enabled
      }

      let res = await api
        .put(path)
        .set("authorization", `bearer ${token}`)
        .send(updates)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body.administrator).toBe(employee.administrator)
      expect(res.body.enabled).toBe(employee.enabled)

      res = await api
        .put(path)
        .set("authorization", `bearer ${tokens.admin}`)
        .send(updates)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body.administrator).toBe(!employee.administrator)
      expect(res.body.enabled).toBe(!employee.enabled)
    })

    test("does not affect any other employees in DB", async () =>
      await tests
        .putOnlyAffectsOne(
          api,
          Employee,
          employee,
          helper.updateEmployee(),
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let updates = helper.updateEmployee()

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .putFailsWithStatusCode(
              api,
              Employee,
              [ updates ],
              path,
              401,
              token
            )))
    })

    test("fails for other non-admin users than employee in question", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Employee,
          [ helper.updateEmployee() ],
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateEmployee()

      await Promise
        .all(invalidIds
          .map(id => tests
            .putFailsWithStatusCode(
              api,
              Employee,
              [ updates ],
              id,
              404,
              tokens.basic
            )))
    })

    test("fails with invalid input", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Employee,
          helper.invalidEmployeeUpdates(),
          path,
          400,
          tokens.admin
        ))
  })

  describe(`PUT ${url}/:id/password`, () => {

    let token
    let validPasswords

    beforeAll(async () => {
      employee = await Employee
        .findOne({ username : "basic2" })

      path = `${url}/${employee._id}/password`
      token = createToken(
        employee, process.env.SECRET, process.env.HANDSHAKE)

      validPasswords = {
        password : "Qwerty_123",
        newPassword : "Trust_no1",
        confirmPassword : "Trust_no1"
      }
    })

    test("succeeds with valid input and auth, and affects only allowed fields", async () => {
      let employeeBefore = await Employee
        .findOne({ username : "basic1" })

      await api
        .put(`${url}/${employeeBefore._id}/password`)
        .set("authorization", `bearer ${tokens.basic}`)
        .send(validPasswords)
        .expect(200)

      let employeeAfter = await Employee
        .findOne({ username : "basic1" })

      Object.keys(employeeAfter._doc).map(key => {
        let original = employeeBefore[key].toString()
        let updated = employeeAfter[key].toString()

        return (key !== "pwHash")
          ? expect(original).toBe(updated)
          : expect(original).not.toBe(updated)
      })

      let pwCheck = await checkPassword("Trust_no1", employeeAfter)
      expect(pwCheck).toBe(true)
    })

    test("does not affect any other employees in DB", async () => {
      let employeeBefore = await Employee
        .findOne({ username : "admin1" })

      await tests
        .putOnlyAffectsOne(
          api,
          Employee,
          employeeBefore,
          validPasswords,
          `${url}/${employeeBefore._id}/password`,
          tokens.admin
        )
    })

    test("fails if not authed as employee in question", async () => {
      let others = await Employee
        .find({ _id : { $ne : employee._id } })

      await Promise
        .all(others
          .map(async (user) => {
            let token = createToken(
              user, process.env.SECRET, process.env.HANDSHAKE)

            await api
              .put(path)
              .set("authorization", `bearer ${token}`)
              .send(validPasswords)
              .expect(403)
          }))
    })

    test("fails if incorrect current password", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Employee,
          [ {
            ...validPasswords,
            password : "Qwerty_124"
          } ],
          path,
          400,
          token
        ))

    test("fails if new password does not meet requirements", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Employee,
          [ {
            password : "Qwerty_123",
            newPassword : "correcthorsebatterystaple",
            confirmPassword : "correcthorsebatterystaple"
          } ],
          path,
          400,
          token
        ))

    test("fails if 'new password' and 'confirm new password' do not match", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Employee,
          [ {
            ...validPasswords,
            confirmPassword : "Trust_no2"
          } ],
          path,
          400,
          token
        ))

    test("fails with invalid or nonexisting id", async () =>
      await Promise
        .all(invalidIds
          .map(id => tests
            .putFailsWithStatusCode(
              api,
              Employee,
              [ validPasswords ],
              `${id}/password`,
              403,
              token
            ))))
  })
})
