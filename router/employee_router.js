const employeeRouter = require("express").Router()
const Employee = require("../model/employee")
const { parseErrors, validatePassword } = require("../util/validator")
const bcrypt = require("bcrypt")
const bcryptCost = 10
const url = "/api/employees"

const excludedFields = { pwHash : 0, __v : 0 } // MAYBE SCHEMA.OPTIONS.TOJSON IS PRETTIER?

const usernameExists = async (username) => {
  let employees = await Employee.find({ username })
  return (employees.length > 0)
}

employeeRouter.get("/", async (req, res) => {
  try {
    let employees = await Employee.find({}, excludedFields)
    res.json(employees)

  } catch (ex) {
    console.log(`Error @ GET ${url}`, ex.message)
    res
      .status(400)
      .send({ error : ex.message })
  }
})

employeeRouter.post("/", async (req, res) => {
  try {
    let employee = new Employee(req.body) // CLEAN-UP METHOD FOR INCOMING REQUEST BODY...?
    let validationResult = employee.validateSync()
    let errors = ( !validationResult )
      ? []
      : parseErrors(validationResult.errors)

    // THIS IS UGLY AS SHIT. SEPARATE CUSTOM VALIDATION METHOD NEEDED...?
    let { username, password } = req.body
    if (await usernameExists(username.trim()))
      errors.push("Käyttäjänimi on jo käytössä")
    if (!validatePassword(password))
      errors.push("Salasana ei täytä vaatimuksia")

    if (errors.length > 0)
      throw ({ message : errors })

    employee.pwHash = await bcrypt
      .hash(password, bcryptCost)

    employee = await employee.save()
    res
      .status(201)
      .json(employee)

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(400)
      .send({ error : ex.message })
  }
})

module.exports = employeeRouter
