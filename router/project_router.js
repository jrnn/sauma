const croppedFields = { createdOn : 0, lastEditedBy : 0 }
const parser = require("../util/parser")
const Project = require("../model/project")
const projectRouter = require("express").Router()
const url = "/api/projects"

const findOneAndPopulate = async (id) =>
  await Project
    .findById(id)
    .populate("client", croppedFields)
    .populate("lastEditedBy", croppedFields)
    .populate("manager", croppedFields)

projectRouter.get("/", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    // FOR BASIC USERS, COULD FILTER ONLY TO THOSE WHICH USER IS ASSIGNED TO ...?

    let projects = await Project
      .find()
      .populate("client", croppedFields)
      .populate("lastEditedBy", croppedFields)
      .populate("manager", croppedFields)

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
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    let project = await findOneAndPopulate(req.params.id)

    if ( project ) res.json(project)
    else
      res
        .status(404)
        .end()

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

module.exports = projectRouter
