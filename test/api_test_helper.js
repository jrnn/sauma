const Client = require("../model/client")
const { createToken } = require("../service/auth_service")
const data = require("./test_data")
const Employee = require("../model/employee")

const clearDb = async () => {
  await Client.remove()
  await Employee.remove()
}

const initClients = async () => {
  let user = await Employee.findOne({ username : "admin_user" })

  await Promise
    .all(data.initClients
      .map(c => c = { ...c, address : randomAddress(), lastEditedBy : user.id })
      .map(c => new Client(c)).map(c => c.save()))
}

const initEmployees = async () =>
  await Promise
    .all(data.initEmployees
      .map(e => e = { ...e, address : randomAddress() })
      .map(e => new Employee(e)).map(e => e.save()))

const initTokens = async () => {
  let basicUser = await Employee.findOne({ username : "basic_user" })
  let adminUser = await Employee.findOne({ username : "admin_user" })

  let admin = createToken(adminUser, process.env.SECRET, process.env.HANDSHAKE)
  let basic = createToken(basicUser, process.env.SECRET, process.env.HANDSHAKE)
  let invalid = createToken(basicUser, "open_sesame", process.env.HANDSHAKE)

  return { admin, basic, invalid }
}

const invalidClients = (userId) => {
  let clients = data.invalidClients
  clients.map(c => c.lastEditedBy = userId)

  return clients
}

const invalidClientUpdates = (userId) => {
  let updates = data.invalidClientUpdates
  updates.map(u => u.lastEditedBy = userId)

  return updates
}

const invalidCredentials = () => data.invalidCredentials

const invalidEmployees = () => data.invalidEmployees

const invalidEmployeeUpdates = () => data.invalidEmployeeUpdates

const newClient = (userId) => {
  let i = randomIdx(data.newClients.length)
  let client = data.newClients.splice(i, 1)[0]

  client.address = randomAddress()
  client.lastEditedBy = userId

  return client
}

const newEmployee = () => {
  let i = randomIdx(data.newEmployees.length)
  let employee = data.newEmployees.splice(i, 1)[0]

  employee.address = randomAddress()
  employee.pwHash = "$2a$10$AHMSsWzm//1w6Lqqgip9huS4KEbODZOS..ZMu1bfhB5gJsumYz1E2"

  return employee
}

const randomAddress = () =>
  data.validAddresses[randomIdx(data.validAddresses.length)]

const randomClient = async () => {
  let clients = await Client.find()
  return clients[randomIdx(clients.length)]
}

const randomEmployee = async () => {
  let employees = await Employee.find()
  return employees[randomIdx(employees.length)]
}

const randomIdx = (n) => Math.floor(Math.random() * n)

const updateClient = (userId) => {
  let i = randomIdx(data.updateClients.length)
  let client = data.updateClients.splice(i, 1)[0]
  client.lastEditedBy = userId

  return client
}

const updateEmployee = () => {
  let i = randomIdx(data.updateEmployees.length)
  let employee = data.updateEmployees.splice(i, 1)[0]

  return employee
}

module.exports = {
  clearDb,
  initClients,
  initEmployees,
  initTokens,
  invalidClients,
  invalidClientUpdates,
  invalidCredentials,
  invalidEmployees,
  invalidEmployeeUpdates,
  newClient,
  newEmployee,
  randomAddress,
  randomClient,
  randomEmployee,
  updateClient,
  updateEmployee
}
