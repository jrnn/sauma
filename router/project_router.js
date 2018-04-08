const croppedFields = { createdOn : 0, lastEditedBy : 0 }
const parser = require("../util/parser")
const Project = require("../model/project")
const projectRouter = require("express").Router()
const url = "/api/projects"

projectRouter.get("/", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

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
    if ( !req.auth || !req.auth.admin )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    let project = await Project
      .findById(req.params.id)
      .populate("client", croppedFields)
      .populate("lastEditedBy", croppedFields)
      .populate("manager", croppedFields)

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
    if ( !req.auth || !req.auth.admin )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    let project = await new Project(req.body).save()
    res
      .status(201)
      .json(project)  // populate() needed...?

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`ERROR @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

projectRouter.put("/:id", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    let project = await Project.findById(req.params.id)
    if ( !project )
      return res
        .status(404)
        .end()

    Project.overwrite(project, req.body, req.auth.admin)
    let updated = await project.save()
    res.json(updated)  // populate() needed...?

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`ERROR @ PUT ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = projectRouter
