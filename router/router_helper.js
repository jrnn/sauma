const bcrypt = require("bcrypt")
const Employee = require("../model/employee")
const validator = require("../util/validator")

const validateEmployee = async (reqBody, isNew = false) => {
  let employee = new Employee(reqBody)
  let validationResult = employee.validateSync()
  let errors = ( !validationResult )
    ? []
    : validator.parseErrors(validationResult.errors)

  if ( !isNew )
    return { employee, errors }

  let employees = await Employee.find({ username : employee.username })
  if (employees.length > 0)
    errors.push("Username is already in use")

  if (!validator.validatePassword(reqBody.password))
    errors.push("Password does not meet requirements")
  employee.pwHash = await bcrypt
    .hash(reqBody.password, Number(process.env.BCRYPT_COST))

  return { employee, errors }
}

module.exports = { validateEmployee }
