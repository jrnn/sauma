const { AuthorizationError } = require("../util/errors")
const Client = require("../model/client")
const clientRouter = require("express").Router()
const {
  findAllPopulated,
  findByIdPopulated,
  wrapHandler
} = require("./helper")

clientRouter.get("/", wrapHandler(async (req, res) => {
  let clients = ( !req.auth.admin )
    ? []
    : await findAllPopulated("Client")

  res
    .status(200)
    .json(clients)
}))

clientRouter.get("/:id", wrapHandler(async (req, res) => {
  if ( !req.auth.admin )
    throw AuthorizationError()

  let client = await findByIdPopulated("Client", req.params.id)
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
  client = await findByIdPopulated("Client", client._id)

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
  let updated = await findByIdPopulated("Client", req.params.id)

  res
    .status(200)
    .json(updated)
}))

module.exports = clientRouter
