const {
  AuthenticationError,
  FauxValidationError
} = require("../util/errors")
const {
  checkPassword,
  checkNewPassword,
  createToken,
  hashPassword
} = require("../util/auth")
const Employee = require("../model/employee")
const loginRouter = require("express").Router()
const VerificationToken = require("../model/verification_token")
const { getUuid, wrapHandler } = require("./helper")

const loginWrapHandler = (f) =>
  (req, res, next) =>
    f(req, res, next)
      .catch(error => next(AuthenticationError()))

loginRouter.post("/", loginWrapHandler(async (req, res) => {
  let { username, password } = req.body
  let employee = await Employee.findOne({ username })
  let pwCheck = await checkPassword(password, employee)

  if ( !(employee && pwCheck) || !employee.enabled )
    throw AuthenticationError()

  let token = createToken(
    employee,
    process.env.SECRET,
    process.env.HANDSHAKE
  )
  let auth = {
    admin : employee.administrator,
    firstName : employee.firstName,
    id : employee._id,
    lastName : employee.lastName,
    token
  }

  res
    .status(200)
    .json(auth)
}))

loginRouter.post("/forgot", wrapHandler(async (req, res) => {
  let email = req.body.email
    .trim()
    .toLowerCase()

  let employee = await Employee
    .findOne({ email })

  await VerificationToken
    .remove({ employee : employee._id })

  if ( !employee.enabled )
    throw new TypeError()

  let token = await new VerificationToken({
    uuid : getUuid(),
    employee : employee._id
  }).save()

  let url = `${req.protocol}://${req.hostname}/reset/${token.uuid}`
  res
    .status(200)    // TEMPORARY SHIT SOLUTION
    .json({ url })  // PRIOR TO NODEMAILER
}))

loginRouter.post("/reset/:uuid", wrapHandler(async (req, res) => {
  let token = await VerificationToken
    .findOne({ uuid : req.params.uuid })

  if ( !VerificationToken.isValid(token.createdOn) ) {
    await VerificationToken
      .findByIdAndRemove(token._id)
    throw new TypeError()
  }

  let employee = await Employee
    .findById(token.employee)

  let errors = await checkNewPassword(req.body, employee, false)
  if ( errors )
    throw FauxValidationError(errors)

  let pwHash = await hashPassword(req.body.newPassword)
  await Employee.findByIdAndUpdate(token.employee, { pwHash })
  await VerificationToken.findByIdAndRemove(token._id)

  res
    .status(200)
    .end()
}))

module.exports = loginRouter
