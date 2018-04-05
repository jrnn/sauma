const bcrypt = require("bcrypt")
const Employee = require("../model/employee")
const parser = require("../util/parser")
const validator = require("../util/validator")

const usernameExists = async (employee) => {
  let employees = await Employee
    .find({ username : employee.username })
    .where({ _id : { $ne : employee.id } })
  return employees.length > 0
}

const validateExisting = async (updates, employee) => {
  Employee.overwrite(updates, employee)
  let errors = parser.parseValidationErrors(employee)

  if (await usernameExists(employee))
    errors.push("Username is already in use")

  return { employee, errors }
}

const validateNew = async (reqBody) => {
  let employee = new Employee(reqBody)
  let errors = parser.parseValidationErrors(employee)

  if (await usernameExists(employee))
    errors.push("Username is already in use")

  if (!validator.validatePassword(reqBody.password))
    errors.push("Password does not meet requirements")
  else
    employee.pwHash = await bcrypt
      .hash(reqBody.password, Number(process.env.BCRYPT_COST))

  return { employee, errors }
}

module.exports = { validateExisting, validateNew }
