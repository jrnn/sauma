const { AuthorizationError } = require("../util/errors")
const Client = require("../model/client")
const clientRouter = require("express").Router()
const { wrapHandler } = require("../util/util")

const employeeFields = {
  administrator : 1,
  firstName : 1,
  lastName : 1
}

const findOneAndPopulate = async (id) =>
  await Client
    .findById(id)
    .populate("lastEditedBy", employeeFields)

clientRouter.get("/", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let clients = await Client
    .find()
    .populate("lastEditedBy", employeeFields)

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
  Client.overwrite(client, req.body, req.auth.admin)
  client.lastEditedBy = req.auth.id

  await client.save()
  let updated = await findOneAndPopulate(req.params.id)

  res
    .status(200)
    .json(updated)
}))

module.exports = clientRouter
