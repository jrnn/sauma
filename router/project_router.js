const { AuthorizationError } = require("../util/errors")
const Employee = require("../model/employee")
const Project = require("../model/project")
const projectRouter = require("express").Router()
const Task = require("../model/task")
const { wrapHandler } = require("../util/util")

const clientFields = { legalEntity : 1 }
const employeeFields = {
  administrator : 1,
  firstName : 1,
  lastName : 1
}

const findOneAndPopulate = async (id) =>
  await Project
    .findById(id)
    .populate("attachments.owner", employeeFields)
    .populate("client", clientFields)
    .populate("employees", employeeFields)
    .populate("lastEditedBy", employeeFields)
    .populate("manager", employeeFields)

projectRouter.get("/", wrapHandler(async (req, res) => {
  let selector = ( req.auth.admin )
    ? {}
    : { employees : req.auth.id }

  let projects = await Project
    .find(selector)
    .populate("attachments.owner", employeeFields)
    .populate("client", clientFields)
    .populate("employees", employeeFields)
    .populate("lastEditedBy", employeeFields)
    .populate("manager", employeeFields)

  res
    .status(200)
    .json(projects)
}))

projectRouter.get("/:id", wrapHandler(async (req, res) => {
  let project = await findOneAndPopulate(req.params.id)
  let idCheck = await Project
    .findOne({ _id : req.params.id, employees : req.auth.id })

  if ( !req.auth.admin && !idCheck )
    throw AuthorizationError()

  project._id  // throws TypeError if !project
  res
    .status(200)
    .json(project)
}))

projectRouter.post("/", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  req.body.lastEditedBy = req.auth.id
  let project = await new Project(req.body).save()
  project = await findOneAndPopulate(project._id)

  res
    .status(201)
    .json(project)
}))

projectRouter.put("/:id", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let project = await Project.findById(req.params.id)
  Project.overwrite(project, req.body)
  project.lastEditedBy = req.auth.id

  await project.save()
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)
}))

projectRouter.get("/:id/tasks", wrapHandler(async (req, res) => {
  let project = await findOneAndPopulate(req.params.id)
  let idCheck = await Project
    .findOne({ _id : req.params.id, employees : req.auth.id })

  if ( !req.auth.admin && !idCheck )
    throw AuthorizationError()

  project._id  // throws TypeError if !project
  let tasks = await Task
    .find({ project : req.params.id })
    .populate("lastEditedBy", employeeFields)

  res
    .status(200)
    .json(tasks)
}))

projectRouter.post("/:id/employees", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let project = await Project.findById(req.params.id)
  let employee = await Employee.findById(req.body.id)

  project.employees = project.employees
    .filter(id => id.toString() !== employee._id.toString())
    .concat(employee._id)

  employee.projects = employee.projects
    .filter(id => id.toString() !== project._id.toString())
    .concat(project._id)

  await project.save()
  await employee.save()

  let updated = await findOneAndPopulate(req.params.id)
  res
    .status(200)
    .json(updated)
}))

module.exports = projectRouter
