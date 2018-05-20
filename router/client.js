const { AuthorizationError } = require("../util/errors")
const Client = require("../model/client")
const clientRouter = require("express").Router()
const { populateSelector, wrapHandler } = require("./helper")

const findOneAndPopulate = async (id) =>
  await Client
    .findById(id)
    .populate("attachments.owner", populateSelector)
    .populate("lastEditedBy", populateSelector)

clientRouter.get("/", wrapHandler(async (req, res) => {
  let clients = ( !req.auth.admin )
    ? {}
    : await Client
      .find()
      .populate("attachments.owner", populateSelector)
      .populate("lastEditedBy", populateSelector)

  res
    .status(200)
    .json(clients)
}))

clientRouter.get("/:id", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let client = await findOneAndPopulate(req.params.id)

  client._id  // throws TypeError if !client
  res
    .status(200)
    .json(client)
}))

clientRouter.post("/", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  req.body.lastEditedBy = req.auth.id
  let client = await new Client(req.body).save()
  client = await findOneAndPopulate(client._id)

  res
    .status(201)
    .json(client)
}))

clientRouter.put("/:id", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let client = await Client.findById(req.params.id)
  Client.overwrite(client, req.body)
  client.lastEditedBy = req.auth.id

  await client.save()
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)
}))

module.exports = clientRouter
