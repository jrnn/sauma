const { app, server } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

const { createToken } = require("../util/auth")
const Employee = require("../model/employee")
const helper = require("./api_test_helper")
const Material = require("../model/material")
const Project = require("../model/project")
const Task = require("../model/task")
const tests = require("./standard_tests")
const url = "/api/tasks"

if ( process.env.NODE_ENV !== "test" ) {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Task API", async () => {

  let materialIds
  let path
  let projectIds
  let task
  let tokens

  let invalidIds = [
    `${url}/all_your_base_are_belong_to_us`,
    `${url}/${new Task()._id}`
  ]

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
    await helper.initMaterials()
    await helper.initClients()
    await helper.initProjects()
    await helper.initTasks()

    let materials = await Material.find()
    let projects = await Project.find()

    materialIds = materials.map(m => m._id)
    projectIds = projects.map(p => p._id)

    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all tasks in DB as JSON", async () =>
      await tests
        .getReturnsAllAsJSON(
          api,
          Task,
          url,
          tokens.admin))

    test("for non-admin user, returns only tasks under projects to which user is assigned", async () =>
      await Promise
        .all([
          "basic1",
          "basic2",
          "basic3"
        ].map(async (username) => {
          let user = await Employee
            .findOne({ username })

          let tasks = await Task
            .find({ project : { $in : user.projects } })

          let token = createToken(
            user, process.env.SECRET, process.env.HANDSHAKE)

          let res = await api
            .get(url)
            .set("authorization", `bearer ${token}`)
            .expect(200)
            .expect("content-type", /application\/json/)

          expect(res.body.length).toBe(tasks.length)
          res.body.map(t => expect(user.projects).toContain(t.project.id))
        })))

    test("fails if invalid token", async () =>
      await Promise
        .all(tokens.invalid
          .map(token => tests
            .getFailsWithStatusCode(
              api,
              url,
              401,
              token
            ))))
  })

  describe(`GET ${url}/:id`, async () => {

    beforeAll(async () => {
      task = await helper.randomTask()
      path = `${url}/${task._id}`
    })

    test("with valid id returns that task as JSON", async () =>
      await tests
        .getReturnsOneAsJSON(
          api,
          Task,
          task,
          path,
          tokens.admin
        ))

    test("for non-admin user, returns task only if assigned to the parent project", async () => {
      let employee = await Employee
        .findOne({ projects : task.project })

      let employees = await Employee
        .find({ administrator : false })
        .where({ projects : { $ne : task.project } })

      await tests
        .getReturnsOneAsJSON(
          api,
          Task,
          task,
          path,
          createToken(employee, process.env.SECRET, process.env.HANDSHAKE)
        )

      await Promise
        .all(employees
          .map(e => tests
            .getFailsWithStatusCode(
              api,
              path,
              403,
              createToken(e, process.env.SECRET, process.env.HANDSHAKE)
            )))
    })

    test("fails if invalid token", async () =>
      await Promise
        .all(tokens.invalid
          .map(token => tests
            .getFailsWithStatusCode(
              api,
              path,
              401,
              token
            ))))

    test("fails with invalid or nonexisting id", async () =>
      await Promise
        .all(invalidIds
          .map(id => tests
            .getFailsWithStatusCode(
              api,
              id,
              404,
              tokens.admin
            ))))
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new task as JSON", async () =>
      await tests
        .postReturnsNewAsJson(
          api,
          Task,
          helper.newTask(projectIds, materialIds),
          url,
          tokens.admin
        ))

    test("does not affect existing tasks in DB", async () =>
      await tests
        .postDoesNotAffectExisting(
          api,
          Task,
          helper.newTask(projectIds, materialIds),
          url,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      task = helper.newTask(projectIds, materialIds)

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .postFailsWithStatusCode(
              api,
              Task,
              [ task ],
              url,
              401,
              token
            )))
    })

    test("fails if not authed as admin", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Task,
          [ helper.newTask(projectIds, materialIds) ],
          url,
          403,
          tokens.basic
        ))

    test("fails with invalid input", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Task,
          helper.invalidTasks(projectIds, materialIds),
          url,
          400,
          tokens.admin
        ))
  })

  describe(`PUT ${url}/:id`, async () => {

    beforeAll(async () => {
      task = helper.newTask(projectIds, materialIds)
      task.lastEditedBy = new Employee()._id
      task = await new Task(task).save()

      path = `${url}/${task._id}`
    })

    test("succeeds with valid input, and affects only related fields", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Task,
          task,
          helper.updateTask(projectIds, materialIds),
          path,
          tokens.admin
        ))

    test("does not affect any other tasks in DB", async () =>
      await tests
        .putOnlyAffectsOne(
          api,
          Task,
          task,
          helper.updateTask(projectIds, materialIds),
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let updates = helper.updateTask(projectIds, materialIds)

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .putFailsWithStatusCode(
              api,
              Task,
              [ updates ],
              path,
              401,
              token
            )))
    })

    test("fails if not authed as admin", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Task,
          [ helper.updateTask(projectIds, materialIds) ],
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateTask(projectIds, materialIds)

      await Promise
        .all(invalidIds
          .map(id => tests
            .putFailsWithStatusCode(
              api,
              Task,
              [ updates ],
              id,
              404,
              tokens.admin
            )))
    })

    test("fails with invalid input", async () =>
      await tests
        .putFailsWithStatusCode(
          api,
          Task,
          helper.invalidTaskUpdates(materialIds),
          path,
          400,
          tokens.admin
        ))
  })
})

afterAll(() => server.close())
