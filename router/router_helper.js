const bcrypt = require("bcrypt")
const Client = require("../model/client")
const Employee = require("../model/employee")
const validator = require("../util/validator")

const validateClient = async (reqBody, isNew = true) => {
  let client = new Client(reqBody)
  let validationResult = client.validateSync()
  let errors = ( !validationResult )
    ? []
    : validator.parseErrors(validationResult.errors)

  if ( !isNew )
    return { client, errors }

  let clients = await Client.find({ businessId : client.businessId })
  if (clients.length > 0)
    errors.push("Business ID is already in use")

  return { client, errors }
}

const validateEmployee = async (reqBody, isNew = true) => {
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
  else
    employee.pwHash = await bcrypt
      .hash(reqBody.password, Number(process.env.BCRYPT_COST))

  return { employee, errors }
}

module.exports = { validateClient, validateEmployee }
