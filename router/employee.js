const { AuthorizationError, FauxValidationError } = require("../util/errors")
const { checkNewPassword, hashPassword } = require("../util/auth")
const Employee = require("../model/employee")
const employeeRouter = require("express").Router()
const { getUuid, wrapHandler } = require("./helper")
const { newUserInvite } = require("../util/mail")
const VerificationToken = require("../model/verification_token")

employeeRouter.get("/", wrapHandler(async (req, res) => {
  let employees = await Employee.find()

  res
    .status(200)
    .json(employees)
}))

employeeRouter.get("/:id", wrapHandler(async (req, res) => {
  let employee = await Employee.findById(req.params.id)

  employee._id  // throws TypeError if !employee
  res
    .status(200)
    .json(employee)
}))

employeeRouter.post("/", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  req.body.pwHash = await hashPassword(`${getUuid()}ABC123abc`)
  let employee = await new Employee(req.body).save()
  employee = await Employee.findById(employee._id)

  let token = await new VerificationToken({
    uuid : getUuid(),
    employee : employee._id
  }).save()

  newUserInvite(
    employee,
    `https://${req.hostname}/reset/${token.uuid}`
  )

  res
    .status(201)
    .json(employee)
}))

employeeRouter.put("/:id", wrapHandler(async (req, res) => {
  let employee = await Employee.findById(req.params.id)

  if ( !req.auth.admin && req.auth.id !== employee.id )
    throw AuthorizationError()

  Employee.overwrite(employee, req.body, req.auth.admin)
  await employee.save()
  let updated = await Employee.findById(req.params.id)

  res
    .status(200)
    .json(updated)
}))

employeeRouter.put("/:id/password", wrapHandler(async (req, res) => {
  let { id } = req.params
  if ( req.auth.id !== id )
    throw AuthorizationError()

  let employee = await Employee.findById(id)
  let errors = await checkNewPassword(req.body, employee)
  if ( errors )
    throw FauxValidationError(errors)

  let pwHash = await hashPassword(req.body.newPassword)
  await Employee.findByIdAndUpdate(id, { pwHash })

  res
    .status(200)
    .end()
}))

module.exports = employeeRouter
