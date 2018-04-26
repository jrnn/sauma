const { app, server } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

const { createToken } = require("../service/auth_service")
const Client = require("../model/client")
const Employee = require("../model/employee")
const Project = require("../model/project")
const helper = require("./api_test_helper")
const tests = require("./standard_tests")
const url = "/api/projects"

if ( process.env.NODE_ENV !== "test" ) {
  server.close()
  throw new Error("Tests must be run in test mode")
}

describe("Project API", async () => {

  let adminId
  let clientIds
  let path
  let project
  let tokens

  let invalidIds = [
    `${url}/all_your_base_are_belong_to_us`,
    `${url}/${new Project()._id}`
  ]

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
    await helper.initClients()
    await helper.initProjects()

    let clients = await Client.find()
    let admin = await Employee
      .findOne({ username : "admin1" })

    adminId = admin._id
    clientIds = clients.map(c => c._id)
    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all projects in DB as JSON", async () =>
      await tests
        .getReturnsAllAsJSON(
          api,
          Project,
          url,
          tokens.admin
        ))

    test("for non-admin user, returns only projects to which user is assigned", async () =>
      await Promise
        .all([
          "basic1",
          "basic2",
          "basic3"
        ].map(async (username) => {
          let user = await Employee
            .findOne({ username })

          let token = createToken(
            user, process.env.SECRET, process.env.HANDSHAKE)

          let res = await api
            .get(url)
            .set("authorization", `bearer ${token}`)
            .expect(200)
            .expect("content-type", /application\/json/)

          let projects = await Project
            .find({ employees : user._id })

          expect(res.body.length).toBe(projects.length)
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
      project = await helper.randomProject()
      path = `${url}/${project.id}`
    })

    test("with valid id returns that project as JSON", async () =>
      await tests
        .getReturnsOneAsJSON(
          api,
          Project,
          project,
          path,
          tokens.admin
        ))

    test("for basic user, returns project only if assigned to that project", async () => {
      /*
       *  TBA
       */
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

    test("succeeds with valid input, and returns new project as JSON", async () =>
      await tests
        .postReturnsNewAsJson(
          api,
          Project,
          helper.newProject(adminId, clientIds),
          url,
          tokens.admin
        ))

    test("does not affect existing projects in DB", async () =>
      await tests
        .postDoesNotAffectExisting(
          api,
          Project,
          helper.newProject(adminId, clientIds),
          url,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      project = helper.newProject(adminId, clientIds)

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .postFailsWithStatusCode(
              api,
              Project,
              [ project ],
              url,
              401,
              token
            )))
    })

    test("fails if not authed as admin", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Project,
          [ helper.newProject(adminId, clientIds) ],
          url,
          403,
          tokens.basic
        ))

    test("fails with invalid input", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Project,
          helper.invalidProjects(adminId, clientIds),
          url,
          400,
          tokens.admin
        ))

    test("cannot set non-admin employee as project manager", async () => {
      let basicUser = await Employee
        .findOne({ username : "basic1" })

      project = helper.newProject(adminId, clientIds)
      project.manager = basicUser._id

      await tests
        .postFailsWithStatusCode(
          api,
          Project,
          [ project ],
          url,
          400,
          tokens.admin
        )
    })
  })

  describe(`PUT ${url}/:id`, async () => {

    let clientId
    let managerId

    beforeAll(async () => {
      project = await new Project(
        helper.newProject(adminId, clientIds)).save()

      let newClient = await new Client(
        helper.newClient(adminId)).save()

      let newManager = await Employee
        .findOne({ username : "admin2" })

      clientId = newClient._id
      managerId = newManager._id
      path = `${url}/${project.id}`
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Project,
          project,
          helper.updateProject(adminId, managerId, clientId),
          path,
          tokens.admin
        ))

    test("does not affect any other projects in DB", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Project,
          project,
          helper.updateProject(adminId, managerId, clientId),
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let updates = helper.updateProject(adminId, managerId, clientId)

      await Promise
        .all(tokens.invalid
          .map(token => tests
            .putFailsWithStatusCode(
              api,
              Project,
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
          Project,
          [ helper.updateProject(adminId, managerId, clientId) ],
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateProject(adminId, managerId, clientId)

      await Promise
        .all(invalidIds
          .map(id => tests
            .putFailsWithStatusCode(
              api,
              Project,
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
          Project,
          helper.invalidProjectUpdates(adminId),
          path,
          400,
          tokens.admin
        ))

    test("cannot set non-admin employee as project manager", async () => {
      let basicUser = await Employee
        .findOne({ username : "basic1" })

      await tests
        .putFailsWithStatusCode(
          api,
          Project,
          [ helper.updateProject(adminId, basicUser._id, clientId) ],
          path,
          400,
          tokens.admin
        )
    })
  })
})

afterAll(() => server.close())
