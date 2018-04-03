const Employee = require("../model/employee")
const jwt = require("jsonwebtoken")
const { parseErrors } = require("../util/validator")

const checkToken = (reqToken) => {
  try {
    let token = jwt.verify(reqToken, process.env.SECRET)
    return ( token.id )
      ? token
      : undefined

  } catch (ex) { return undefined }
}

const checkEmployee = (reqBody) => {
  let employee = new Employee(reqBody)
  let validationResult = employee.validateSync()
  let errors = ( !validationResult )
    ? []
    : parseErrors(validationResult.errors)

  return { employee, errors }
}

module.exports = { checkEmployee, checkToken }
