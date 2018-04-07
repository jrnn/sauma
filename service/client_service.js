const Client = require("../model/client")
const parser = require("../util/parser")

const businessIdExists = async (client) => {
  let clients = await Client
    .find({ businessId : client.businessId })
    .where({ _id : { $ne : client.id } })

  return clients.length > 0
}

const validateExisting = async (updates, client) => {
  Client.overwrite(updates, client)
  let errors = parser.parseValidationErrors(client)

  if (await businessIdExists(client))
    errors.push("Business ID is already in use")

  return { client, errors }
}

const validateNew = async (reqBody) => {
  let client = new Client(reqBody)
  let errors = parser.parseValidationErrors(client)

  if (await businessIdExists(client))
    errors.push("Business ID is already in use")

  return { client, errors }
}

module.exports = {
  validateExisting,
  validateNew
}
