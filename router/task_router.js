const { AuthorizationError } = require("../util/errors")
const Employee = require("../model/employee")
const Task = require("../model/task")
const taskRouter = require("express").Router()
const { wrapHandler } = require("../util/util")

const employeeFields = {
  administrator : 1,
  firstName : 1,
  lastName : 1
}
const materialFields = {
  color : 1,
  _id : 1,
  name : 1,
  unit : 1,
  unitCost : 1
}
const projectFields = {
  client : 1,
  employees : 1,
  endDate : 1,
  _id : 1,
  manager : 1,
  projectId : 1,
  startDate : 1
}

const findOneAndPopulate = async (id) =>
  await Task
    .findById(id)
    .populate("lastEditedBy", employeeFields)
    .populate("project", projectFields)
    .populate("quotas.material", materialFields)

taskRouter.get("/", wrapHandler(async (req, res) => {
  let employee = await Employee.findById(req.auth.id)

  let selector = ( req.auth.admin )
    ? {}
    : { project : { $in : employee.projects } }

  let tasks = await Task
    .find(selector)
    .populate("lastEditedBy", employeeFields)
    .populate("project", projectFields)
    .populate("quotas.material", materialFields)

  res
    .status(200)
    .json(tasks)
}))

taskRouter.get("/:id", wrapHandler(async (req, res) => {
  let task = await findOneAndPopulate(req.params.id)
  let idCheck = await Employee
    .count({ projects : task.project })
    .where({ _id : req.auth.id })

  if ( !req.auth.admin && idCheck === 0 )
    throw AuthorizationError()

  task._id  // throws TypeError if !task
  res
    .status(200)
    .json(task)
}))

taskRouter.post("/", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  req.body.lastEditedBy = req.auth.id
  let task = await new Task(req.body).save()
  task = await findOneAndPopulate(task._id)

  res
    .status(201)
    .json(task)
}))

taskRouter.put("/:id", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let task = await Task.findById(req.params.id)
  Task.overwrite(task, req.body, req.auth.admin)
  task.lastEditedBy = req.auth.id

  await task.save()
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)

}))

module.exports = taskRouter
