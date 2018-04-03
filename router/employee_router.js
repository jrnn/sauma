const bcrypt = require("bcrypt")
const { checkEmployee, checkToken } = require("./router_helper")
const Employee = require("../model/employee")
const { validatePassword } = require("../util/validator")

const employeeRouter = require("express").Router()
const url = "/api/employees"

const usernameExists = async (username) => {
  let employees = await Employee.find({ username })
  return (employees.length > 0)
}

employeeRouter.get("/", async (req, res) => {
  try {
    let token = checkToken(req.token)
    if ( !token ) return res
      .status(401)
      .json({ error : "Invalid or missing token" })

    let employees = await Employee.find()
    res.json(employees)

  } catch (ex) {
    console.log(`Error @ GET ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

employeeRouter.post("/", async (req, res) => {
  try {
    let token = checkToken(req.token)
    if ( !token || !token.admin ) return res
      .status(401)
      .json({ error : "Invalid or missing token" })

    let { employee, errors } = checkEmployee(req.body)
    let { password } = req.body

    if (await usernameExists(employee.username.trim()))
      errors.push("Username is already in use")
    if (!validatePassword(password))
      errors.push("Password does not meet requirements")

    if (errors.length > 0)
      throw ({ message : errors })

    employee.pwHash = await bcrypt
      .hash(password, Number(process.env.BCRYPT_COST))

    employee = await employee.save()
    res
      .status(201)
      .json(employee)

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = employeeRouter
