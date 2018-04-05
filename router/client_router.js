const Client = require("../model/client")
const clientRouter = require("express").Router()
const employeeFields = { firstName : 1, lastName : 1 }
const service = require("../service/client_service")
const url = "/api/clients"

clientRouter.get("/", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    let clients = await Client
      .find()
      .populate("lastEditedBy", employeeFields)

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
    if ( !req.auth || !req.auth.admin ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    let client = await Client
      .findById(req.params.id)
      .populate("lastEditedBy", employeeFields)

    if ( client ) res
      .json(client)
    else res
      .status(404).end()

  } catch (ex) {
    console.log(`Error @ GET ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

clientRouter.post("/", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    req.body.lastEditedBy = req.auth.id

    let { client, errors } = await service
      .validateNew(req.body)
    if (errors.length > 0)
      throw ({ message : errors })

    client = await client.save()
    res
      .status(201)
      .json(client)  // populate() needed...?

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

clientRouter.put("/:id", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    req.body.lastEditedBy = req.auth.id
    let original = await Client.findById(req.params.id)

    let { client, errors } = await service
      .validateExisting(req.body, original)
    if (errors.length > 0)
      throw ({ message : errors })

    let updated = await Client
      .findByIdAndUpdate(req.params.id, client, { new : true })
      .populate("lastEditedBy", employeeFields)  // necessary...?

    if ( !updated ) res
      .status(404).end()
    else res
      .json(updated)

  } catch (ex) {
    console.log(`Error @ PUT ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = clientRouter
