const { AuthorizationError } = require("../util/errors")
const Material = require("../model/material")
const materialRouter = require("express").Router()
const { wrapHandler } = require("../util/util")

const employeeFields = {
  administrator : 1,
  firstName : 1,
  lastName : 1
}

const findOneAndPopulate = async (id) =>
  await Material
    .findById(id)
    .populate("lastEditedBy", employeeFields)

materialRouter.get("/", wrapHandler(async (req, res) => {
  let materials = await Material
    .find()
    .populate("lastEditedBy", employeeFields)

  res
    .status(200)
    .json(materials)
}))

materialRouter.get("/:id", wrapHandler(async (req, res) => {
  let material = await findOneAndPopulate(req.params.id)

  material._id  // throws TypeError if !material
  res
    .status(200)
    .json(material)
}))

materialRouter.post("/", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  req.body.lastEditedBy = req.auth.id
  let material = await new Material(req.body).save()
  material = await findOneAndPopulate(material._id)

  res
    .status(201)
    .send(material)
}))

materialRouter.put("/:id", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let material = await Material.findById(req.params.id)
  Material.overwrite(material, req.body, req.auth.admin)
  material.lastEditedBy = req.auth.id

  await material.save()
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)
}))

module.exports = materialRouter
