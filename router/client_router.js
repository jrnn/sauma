const Client = require("../model/client")
const clientRouter = require("express").Router()
const croppedFields = { createdOn : 0, lastEditedBy : 0 }
const parser = require("../util/parser")
const url = "/api/clients"

clientRouter.get("/", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    let clients = await Client
      .find()
      .populate("lastEditedBy", croppedFields)

    res.json(clients)

  } catch (ex) {
    console.log(`Error @ GET ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

clientRouter.get("/:id", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    let client = await Client
      .findById(req.params.id)
      .populate("lastEditedBy", croppedFields)

    if ( client ) res.json(client)
    else
      res
        .status(404)
        .end()

  } catch (ex) {
    console.log(`Error @ GET ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

clientRouter.post("/", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    req.body.lastEditedBy = req.auth.id
    let client = await new Client(req.body).save()

    res
      .status(201)
      .json(client)  // populate() needed...?

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ [ex.name] : ex.message })
  }
})

clientRouter.put("/:id", async (req, res) => {
  try {
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    let client = await Client.findById(req.params.id)
    if ( !client )
      return res
        .status(404)
        .end()

    Client.overwrite(client, req.body, req.auth.admin)
    client.lastEditedBy = req.auth.id

    let updated = await client.save()
    res.json(updated)  // populate() needed...?

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`Error @ PUT ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ [ex.name] : ex.message })
  }
})

module.exports = clientRouter
