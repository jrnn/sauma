const { AuthorizationError } = require("../util/errors")
const Material = require("../model/material")
const materialRouter = require("express").Router()
const { populateSelector, wrapHandler } = require("./helper")

const findOneAndPopulate = async (id) =>
  await Material
    .findById(id)
    .populate("attachments.owner", populateSelector)
    .populate("lastEditedBy", populateSelector)

materialRouter.get("/", wrapHandler(async (req, res) => {
  let materials = await Material
    .find()
    .populate("attachments.owner", populateSelector)
    .populate("lastEditedBy", populateSelector)

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
