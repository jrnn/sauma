const { AuthorizationError } = require("../util/errors")
const Employee = require("../model/employee")
const Project = require("../model/project")
const projectRouter = require("express").Router()
const {
  findAllPopulated,
  findByIdPopulated,
  populateSelector,
  wrapHandler
} = require("./helper")
const Task = require("../model/task")
const { addCoordinatesToAddress } = require("../util/geocoder")

projectRouter.get("/", wrapHandler(async (req, res) => {
  let selector = ( req.auth.admin )
    ? {}
    : { employees : req.auth.id }

  let projects = await findAllPopulated("Project", selector)
  res
    .status(200)
    .json(projects)
}))

projectRouter.get("/:id", wrapHandler(async (req, res) => {
  let project = await findByIdPopulated("Project", req.params.id)

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

  const body = {
    ...req.body,
    address : await addCoordinatesToAddress(req.body.address),
    lastEditedBy : req.auth.id
  }
  const project = await new Project(body).save()
  const _project = await findByIdPopulated("Project", project._id)

  res
    .status(201)
    .json(_project)
}))

projectRouter.put("/:id", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  const project = await Project.findById(req.params.id)
  Project.overwrite(project, req.body)
  project.lastEditedBy = req.auth.id

  const { address } = req.body
  if ( address ) {
    project.address = await addCoordinatesToAddress(address)
  }
  await project.save()
  const _project = await findByIdPopulated("Project", req.params.id)

  res
    .status(200)
    .json(_project)
}))

projectRouter.get("/:id/tasks", wrapHandler(async (req, res) => {
  let project = await Project.findById(req.params.id)
  let idCheck = await Project
    .findOne({ _id : req.params.id, employees : req.auth.id })

  if ( !req.auth.admin && !idCheck )
    throw AuthorizationError()

  project._id  // throws TypeError if !project

  let projectSelector = Object.assign({}, populateSelector)
  delete projectSelector.employees

  let tasks = await Task
    .find({ project : req.params.id })
    .populate("attachments.owner", populateSelector)
    .populate("comments.owner", populateSelector)
    .populate("lastEditedBy", populateSelector)
    .populate("project", projectSelector)
    .populate("quotas.material", populateSelector)

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

  let updated = await findByIdPopulated("Project", req.params.id)
  res
    .status(200)
    .json(updated)
}))

module.exports = projectRouter
