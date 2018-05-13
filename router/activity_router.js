const { AuthorizationError, CustomError } = require("../util/errors")
const Activity = require("../model/activity")
const activityRouter = require("express").Router()
const Employee = require("../model/employee")
const Task = require("../model/task")
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
  endDate : 1,
  _id : 1,
  manager : 1,
  projectId : 1,
  startDate : 1
}
const taskFields = {
  completed : 1,
  _id : 1,
  name : 1
}

const findOneAndPopulate = async (id) =>
  await Activity
    .findById(id)
    .populate("lastEditedBy", employeeFields)
    .populate("owner", employeeFields)
    .populate("project", projectFields)
    .populate("quotas.material", materialFields)
    .populate("task", taskFields)

activityRouter.get("/", wrapHandler(async (req, res) => {
  let employee = await Employee.findById(req.auth.id)

  let selector = ( req.auth.admin )
    ? {}
    : { project : { $in : employee.projects } }

  let activities = await Activity
    .find(selector)
    .populate("lastEditedBy", employeeFields)
    .populate("owner", employeeFields)
    .populate("project", projectFields)
    .populate("quotas.material", materialFields)
    .populate("task", taskFields)

  res
    .status(200)
    .json(activities)
}))

activityRouter.get("/:id", wrapHandler(async (req, res) => {
  let activity = await findOneAndPopulate(req.params.id)
  let idCheck = await Employee
    .count({ projects : activity.project })
    .where({ _id : req.auth.id })

  if ( !req.auth.admin && idCheck === 0 )
    throw AuthorizationError()

  activity._id  // throws TypeError if !activity
  res
    .status(200)
    .json(activity)
}))

activityRouter.post("/", wrapHandler(async (req, res) => {
  req.body.lastEditedBy = req.auth.id
  req.body.owner = req.auth.id

  delete req.body.project
  let errors = new Activity(req.body).validateSync()

  if ( errors )
    throw errors

  let task = await Task.findOne({ _id : req.body.task })

  if ( task.completed )
    throw CustomError(
      "TaskCompletedError",
      "Task in question has already been marked as completed",
      400
    )

  let idCheck = await Employee
    .count({ projects : task.project })
    .where({ _id : req.auth.id })

  if ( idCheck === 0 )
    throw AuthorizationError()

  req.body.project = task.project
  let activity = await new Activity(req.body).save()
  activity = await findOneAndPopulate(activity._id)

  res
    .status(201)
    .json(activity)
}))

activityRouter.put("/:id", wrapHandler(async (req, res) => {
  let activity = await Activity.findById(req.params.id)

  if ( activity.owner.toString() !== req.auth.id )
    throw AuthorizationError()

  if ( activity.signed )
    throw CustomError(
      "ActivitySignedError",
      "Activity in question has already been marked as signed",
      400
    )

  Activity.overwrite(activity, req.body, req.auth.admin)
  activity.lastEditedBy = req.auth.id

  await activity.save()
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)
}))

activityRouter.put("/:id/sign", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  await Activity.findByIdAndUpdate(req.params.id, { signed : true })
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)
}))

module.exports = activityRouter
