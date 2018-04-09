const Client = require("../model/client")
const { createToken } = require("../service/auth_service")
const data = require("./test_data")
const Employee = require("../model/employee")
const Project = require("../model/project")

const clearDb = async () => {
  await Client.remove()
  await Employee.remove()
  await Project.remove()
}

const initClients = async () => {
  let user = await Employee.findOne({ username : "admin_user" })

  await Promise
    .all(data.initClients
      .map(c => c = { ...c, address : randomAddress() })
      .map(c => c = { ...c, lastEditedBy : user.id })
      .map(c => new Client(c))
      .map(c => c.save()))
}

const initEmployees = async () =>
  await Promise
    .all(data.initEmployees
      .map(e => e = { ...e, address : randomAddress() })
      .map(e => new Employee(e))
      .map(e => e.save()))

const initProjects = async () => {
  let manager = await Employee.findOne({ username : "admin_user" })
  let clients = await Client.find()

  await Promise
    .all(data.initProjects
      .map(p => p = { ...p, address : randomAddress() })
      .map(p => p = { ...p, lastEditedBy : manager.id })
      .map(p => p = { ...p, manager : manager.id })
      .map(p => p = { ...p, client : clients[randomIdx(clients.length)].id })
      .map(p => new Project(p))
      .map(p => p.save()))
}

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

const invalidProjects = (userId, clientIds) => {
  let projects = data.invalidProjects(
    userId, clientIds[randomIdx(clientIds.length)])
  projects.map(p => p.lastEditedBy = userId)

  return projects
}

const invalidProjectUpdates = (userId) => {
  let updates = data.invalidProjectUpdates
  updates.map(u => u.lastEditedBy = userId)

  return updates
}

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

const newProject = (userId, clientIds) => {
  let i = randomIdx(data.newProjects.length)
  let project = data.newProjects.splice(i, 1)[0]

  project.address = randomAddress()
  project.lastEditedBy = userId
  project.manager = userId
  project.client = clientIds[randomIdx(clientIds.length)]

  return project
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

const randomProject = async () => {
  let projects = await Project.find()
  return projects[randomIdx(projects.length)]
}

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

const updateProject = (userId, managerId, clientId) => {
  let i = randomIdx(data.updateProjects.length)
  let project = data.updateProjects.splice(i, 1)[0]

  project.lastEditedBy = userId
  project.manager = managerId
  project.client = clientId

  return project
}

module.exports = {
  clearDb,
  initClients,
  initEmployees,
  initProjects,
  initTokens,
  invalidClients,
  invalidClientUpdates,
  invalidCredentials,
  invalidEmployees,
  invalidEmployeeUpdates,
  invalidProjects,
  invalidProjectUpdates,
  newClient,
  newEmployee,
  newProject,
  randomAddress,
  randomClient,
  randomEmployee,
  randomProject,
  updateClient,
  updateEmployee,
  updateProject
}
