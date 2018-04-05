const Client = require("../model/client")
const data = require("./test_data")
const Employee = require("../model/employee")
const jwt = require("jsonwebtoken")

const createToken = (employee, key) =>
  jwt.sign({
    handshake : process.env.HANDSHAKE,
    id : employee.id,
    firstName : employee.firstName,
    admin : employee.administrator
  }, key)

const initClients = async () => {
  let user = await Employee.findOne({ username : "admin_user" })

  await Client.remove()
  await Promise
    .all(data.initClients(user.id)
      .map(c => c = { ...c, address : randomAddress() })
      .map(c => new Client(c)).map(c => c.save()))
}

const initEmployees = async () => {
  await Employee.remove()
  await Promise
    .all(data.initEmployees()
      .map(e => e = { ...e, address : randomAddress() })
      .map(e => new Employee(e)).map(e => e.save()))
}

const initTokens = async () => {
  let basicUser = await Employee.findOne({ username : "basic_user" })
  let adminUser = await Employee.findOne({ username : "admin_user" })

  let admin = createToken(adminUser, process.env.SECRET)
  let basic = createToken(basicUser, process.env.SECRET)
  let invalid = createToken(basicUser, "open_sesame")

  return { admin, basic, invalid }
}

// THESE ARE POINTLESS ...
const invalidClients = data.invalidClients
const invalidCredentials = data.invalidCredentials
const invalidEmployees = data.invalidEmployees

const newClient = () => {
  let i = randomIdx(data.newClients.length)
  let client = data.newClients.splice(i, 1)[0]
  client.address = randomAddress()
  return client
}

const newEmployee = () => {
  let i = randomIdx(data.newEmployees.length)
  let employee = data.newEmployees.splice(i, 1)[0]
  employee.address = randomAddress()
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

module.exports = {
  createToken,
  initClients, initEmployees, initTokens,
  invalidClients, invalidCredentials, invalidEmployees,
  newClient, newEmployee,
  randomAddress, randomClient, randomEmployee,
}
