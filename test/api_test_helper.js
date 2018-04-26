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
  let user = await Employee
    .findOne({ username : "admin1" })

  await Promise
    .all(data.initClients
      .map(c => c = { ...c, address : random(data.validAddresses) })
      .map(c => c = { ...c, lastEditedBy : user.id })
      .map(c => new Client(c).save()))
}

const initEmployees = async () =>
  await Promise
    .all(data.initEmployees
      .map(e => e = { ...e, address : random(data.validAddresses) })
      .map(e => e = { ...e, pwHash : random(data.validHashes) })
      .map(e => new Employee(e).save()))

const initProjects = async () => {
  let clients = await Client.find()
  let manager = await Employee
    .findOne({ username : "admin1" })

  await Promise
    .all(data.initProjects
      .map(p => p = { ...p, address : random(data.validAddresses) })
      .map(p => p = { ...p, lastEditedBy : manager.id })
      .map(p => p = { ...p, client : random(clients).id })
      .map(p => p = { ...p, manager : manager.id })
      .map(p => new Project(p).save()))

  let projects = await Project.find()
  let employees = await Employee
    .find({ username : [ "basic1", "basic2" ] })

  let i = 0
  projects.map(p => {
    i = (i + 1) % 2
    p.employees = p.employees.concat(employees[i]._id)
    employees[i].projects = employees[i].projects.concat(p._id)
  })

  await Promise.all(employees.map(e => e.save()))
  await Promise.all(projects.map(p => p.save()))
}

const initTokens = async () => {
  let handshake = process.env.HANDSHAKE
  let secret = process.env.SECRET

  let basicUser = await Employee
    .findOne({ username : "basic1" })
  let adminUser = await Employee
    .findOne({ username : "admin1" })

  return {
    admin : createToken(adminUser, secret, handshake),
    basic : createToken(basicUser, secret, handshake),
    invalid : [
      undefined,
      createToken(basicUser, "open_sesame", handshake),
      createToken(basicUser, secret, "open_sesame"),
      createToken(basicUser, "open_sesame", "open_sesame")
    ]
  }
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

const invalidCredentials = () =>
  data.invalidCredentials

const invalidEmployees = () =>
  data.invalidEmployees

const invalidEmployeeUpdates = () =>
  data.invalidEmployeeUpdates

const invalidProjects = (userId, clientIds) => {
  let projects = data.invalidProjects(userId, random(clientIds))
  projects.map(p => p.lastEditedBy = userId)

  return projects
}

const invalidProjectUpdates = (userId) => {
  let updates = data.invalidProjectUpdates
  updates.map(u => u.lastEditedBy = userId)

  return updates
}

const newClient = (userId) => {
  let i = randomIndex(data.newClients.length)
  let client = data.newClients.splice(i, 1)[0]

  client.address = random(data.validAddresses)
  client.lastEditedBy = userId

  return client
}

const newEmployee = () => {
  let i = randomIndex(data.newEmployees.length)
  let employee = data.newEmployees.splice(i, 1)[0]

  employee.address = random(data.validAddresses)
  employee.pwHash = random(data.validHashes)

  return employee
}

const newProject = (userId, clientIds) => {
  let i = randomIndex(data.newProjects.length)
  let project = data.newProjects.splice(i, 1)[0]

  project.address = random(data.validAddresses)
  project.lastEditedBy = userId
  project.manager = userId
  project.client = random(clientIds)

  return project
}

const random = (array) =>
  array[randomIndex(array.length)]

const randomIndex = (n) =>
  Math.floor(Math.random() * n)

const randomClient = async () => {
  let clients = await Client.find()
  return random(clients)
}

const randomEmployee = async () => {
  let employees = await Employee.find()
  return random(employees)
}

const randomProject = async () => {
  let projects = await Project.find()
  return random(projects)
}

const updateClient = (userId) => {
  let i = randomIndex(data.updateClients.length)
  let client = data.updateClients.splice(i, 1)[0]
  client.lastEditedBy = userId

  return client
}

const updateEmployee = () => {
  let i = randomIndex(data.updateEmployees.length)
  let employee = data.updateEmployees.splice(i, 1)[0]

  return employee
}

const updateProject = (userId, managerId, clientId) => {
  let i = randomIndex(data.updateProjects.length)
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
  randomClient,
  randomEmployee,
  randomProject,
  updateClient,
  updateEmployee,
  updateProject
}
