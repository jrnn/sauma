const { AuthorizationError } = require("../util/errors")
const Employee = require("../model/employee")
const employeeRouter = require("express").Router()
const { hashPassword } = require("../service/auth_service")
const { wrapHandler } = require("../util/util")

const projectFields = {
  client : 1,
  endDate : 1,
  projectId : 1,
  startDate : 1
}

const findOneAndPopulate = async (id) =>
  await Employee
    .findById(id)
    .populate("projects", projectFields)

employeeRouter.get("/", wrapHandler(async (req, res) => {
  let employees = await Employee
    .find()
    .populate("projects", projectFields)

  res
    .status(200)
    .json(employees)
}))

employeeRouter.get("/:id", wrapHandler(async (req, res) => {
  let employee = await findOneAndPopulate(req.params.id)

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
  req.body.pwHash = await hashPassword("Qwerty_123")

  let employee = await new Employee(req.body).save()
  employee = await findOneAndPopulate(employee._id)

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
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)
}))

module.exports = employeeRouter
