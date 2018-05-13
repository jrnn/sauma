const { AuthenticationError } = require("../util/errors")
const { checkPassword, createToken } = require("../util/auth")
const Employee = require("../model/employee")
const loginRouter = require("express").Router()

loginRouter.post("/", loginWrapHandler(async (req, res) => {
  let { username, password } = req.body
  let employee = await Employee.findOne({ username })
  let pwCheck = await checkPassword(password, employee)

  if ( !(employee && pwCheck) || !employee.enabled )
    throw AuthenticationError()

  let token = createToken(employee, process.env.SECRET, process.env.HANDSHAKE)
  let auth = {
    admin : employee.administrator,
    firstName : employee.firstName,
    id : employee._id,
    token
  }

  res
    .status(200)
    .json(auth)
}))

function loginWrapHandler(fn) {
  return function(req, res, next) {
    fn(req, res, next)
      .catch(error => next(AuthenticationError()))
  }
}

module.exports = loginRouter
