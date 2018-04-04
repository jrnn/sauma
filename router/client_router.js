const Client = require("../model/client")
const clientRouter = require("express").Router()
const helper = require("./router_helper")
const url = "/api/clients"

clientRouter.get("/", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    let clients = await Client.find()
    res.json(clients)

  } catch (ex) {
    console.log(`Error @ GET ${url}`, ex.message)
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

    let { client, errors } = await helper
      .validateClient(req.body, true)
    if (errors.length > 0)
      throw ({ message : errors })

    client = await client.save()
    res
      .status(201)
      .json(client)

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = clientRouter
