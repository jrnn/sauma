const { AuthorizationError, FauxValidationError } = require("../util/errors")
const { checkNewPassword, hashPassword } = require("../util/auth")
const Employee = require("../model/employee")
const employeeRouter = require("express").Router()
const { wrapHandler } = require("./helper")

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

  // temporary bullshit arrangement just for dev purposes
  // should be  ... await hashPassword(req.body.password)
  req.body.pwHash = await hashPassword(process.env.STD_PW || "Qwerty_123")

  let employee = await new Employee(req.body).save()
  employee = await Employee.findById(employee._id)

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