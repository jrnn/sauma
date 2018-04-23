const Employee = require("../model/employee")
const parser = require("../util/parser")
const Project = require("../model/project")
const projectRouter = require("express").Router()
const url = "/api/projects"

const clientFields = { legalEntity : 1 }
const employeeFields = {
  administrator : 1,
  firstName : 1,
  lastName : 1
}

const findOneAndPopulate = async (id) =>
  await Project
    .findById(id)
    .populate("client", clientFields)
    .populate("employees", employeeFields)
    .populate("lastEditedBy", employeeFields)
    .populate("manager", employeeFields)

projectRouter.get("/", async (req, res) => {
  try {
    let selector = ( req.auth.admin )
      ? {}
      : { employees : req.auth.id }

    let projects = await Project
      .find(selector)
      .populate("client", clientFields)
      .populate("employees", employeeFields)
      .populate("lastEditedBy", employeeFields)
      .populate("manager", employeeFields)

    res.json(projects)

  } catch (ex) {
    console.log(`ERROR @ GET ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

projectRouter.get("/:id", async (req, res) => {
  try {
    let project = await findOneAndPopulate(req.params.id)

    if ( !project )
      return res
        .status(404)
        .end()

    let idCheck = (project.employees
      .map(e => e._id)
      .filter(id => id.toString() === req.auth.id)
      .length) > 0

    if ( !req.auth.admin && !idCheck )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    res.json(project)

  } catch (ex) {
    console.log(`ERROR @ GET ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

projectRouter.post("/", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    req.body.lastEditedBy = req.auth.id
    let project = await new Project(req.body).save()
    project = await findOneAndPopulate(project._id)

    res
      .status(201)
      .json(project)

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`ERROR @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ [ex.name] : ex.message })
  }
})

projectRouter.put("/:id", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    let project = await Project.findById(req.params.id)
    if ( !project )
      return res
        .status(404)
        .end()

    Project.overwrite(project, req.body, req.auth.admin)
    project.lastEditedBy = req.auth.id

    await project.save()
    let updated = await findOneAndPopulate(req.params.id)

    res.json(updated)

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`ERROR @ PUT ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ [ex.name] : ex.message })
  }
})

projectRouter.post("/:id/employees", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    let project = await Project.findById(req.params.id)
    let employee = await Employee.findById(req.body.id)

    if ( !project || !employee )
      return res
        .status(404)
        .end()

    project.employees = project.employees
      .filter(id => id.toString() !== employee._id.toString())
      .concat(employee._id)
    employee.projects = employee.projects
      .filter(id => id.toString() !== project._id.toString())
      .concat(project._id)

    await project.save()
    await employee.save()

    let updated = await findOneAndPopulate(req.params.id)
    res.json(updated)

  } catch (ex) {
    console.log(`ERROR @ POST ${url}/${req.params.id}/employees`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = projectRouter
