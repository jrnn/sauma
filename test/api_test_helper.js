const Client = require("../model/client")
const { createToken } = require("../service/auth_service")
const data = require("./test_data")
const Employee = require("../model/employee")
const Material = require("../model/material")
const Project = require("../model/project")
const Task = require("../model/task")

const clearDb = async () => {
  await Client.remove()
  await Employee.remove()
  await Material.remove()
  await Project.remove()
  await Task.remove()
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

const initMaterials = async () => {
  let user = await Employee
    .findOne({ username : "admin1" })

  await Promise
    .all(data.initMaterials
      .map(m => m = { ...m, lastEditedBy : user._id })
      .map(m => new Material(m).save()))
}

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

const initTasks = async () => {
  let materials = await Material.find()
  let materialIds = materials.map(m => m._id)

  let projects = await Project.find()
  let user = await Employee
    .findOne({ username : "admin1" })

  await Promise
    .all(data.initTasks
      .map(t => t = { ...t, lastEditedBy : user._id })
      .map(t => t = { ...t, project : random(projects)._id })
      .map(t => t = { ...t, quotas : randomQuotas(materialIds) })
      .map(t => new Task(t).save()))
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

const invalidMaterials = (userId) => {
  let materials = data.invalidMaterials
  materials.map(m => m.lastEditedBy = userId)

  return materials
}

const invalidMaterialUpdates = (userId) => {
  let materials = data.invalidMaterialUpdates
  materials.map(m => m.lastEditedBy = userId)

  return materials
}

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

const invalidTasks = (userId, projectIds, materialIds) => {
  let tasks = data.invalidTasks(random(projectIds), random(materialIds))
  tasks.map(t => t.lastEditedBy = userId)

  return tasks
}

const invalidTaskUpdates = (materialIds) =>
  data.invalidTaskUpdates(random(materialIds))

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

const newMaterial = (userId) => {
  let i = randomIndex(data.newMaterials.length)
  let material = data.newMaterials.splice(i, 1)[0]

  material.lastEditedBy = userId
  return material
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

const newTask = (userId, projectIds, materialIds) => {
  let i = randomIndex(data.newTasks.length)
  let task = data.newTasks.splice(i, 1)[0]

  task.lastEditedBy = userId
  task.project = random(projectIds)
  task.quotas = randomQuotas(materialIds)

  return task
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

const randomMaterial = async () => {
  let materials = await Material.find()
  return random(materials)
}

const randomProject = async () => {
  let projects = await Project.find()
  return random(projects)
}

const randomQuotas = (materialIds, quotas = []) => {
  let ids = materialIds.slice(0)
  let n = Math.floor(Math.random() * 4)

  while (n > 0) {
    n--
    let i = randomIndex(ids.length)
    quotas = [ ...quotas,
      {
        material : ids.splice(i, 1)[0],
        quantity : Math.floor(Math.random() * 9999)
      }
    ]
  }

  return quotas
}

const randomTask = async () => {
  let tasks = await Task.find()
  return random(tasks)
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

const updateMaterial = (userId) => {
  let i = randomIndex(data.updateMaterials.length)
  let material = data.updateMaterials.splice(i, 1)[0]

  material.lastEditedBy = userId
  return material
}

const updateProject = (userId, managerId, clientId) => {
  let i = randomIndex(data.updateProjects.length)
  let project = data.updateProjects.splice(i, 1)[0]

  project.lastEditedBy = userId
  project.manager = managerId
  project.client = clientId

  return project
}

const updateTask = (projectIds, materialIds) => {
  let i = randomIndex(data.updateTasks.length)
  let task = data.updateTasks.splice(i, 1)[0]

  task.project = random(projectIds)
  task.quotas = randomQuotas(materialIds)

  return task
}

module.exports = {
  clearDb,
  initClients,
  initEmployees,
  initMaterials,
  initProjects,
  initTasks,
  initTokens,
  invalidClients,
  invalidClientUpdates,
  invalidCredentials,
  invalidEmployees,
  invalidEmployeeUpdates,
  invalidMaterials,
  invalidMaterialUpdates,
  invalidProjects,
  invalidProjectUpdates,
  invalidTasks,
  invalidTaskUpdates,
  newClient,
  newEmployee,
  newMaterial,
  newProject,
  newTask,
  randomClient,
  randomEmployee,
  randomMaterial,
  randomProject,
  randomTask,
  updateClient,
  updateEmployee,
  updateMaterial,
  updateProject,
  updateTask
}
