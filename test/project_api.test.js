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

  let clientIds
  let path
  let project
  let tokens
  let userId

  let invalidId = `${url}/all_your_base_are_belong_to_us`
  let nonExistingId = `${url}/${new Project()._id}`

  beforeAll(async () => {
    await helper.clearDb()
    await helper.initEmployees()
    await helper.initClients()
    await helper.initProjects()

    let user = await Employee.findOne({ username : "admin_user" })
    userId = user._id

    let clients = await Client.find()
    clientIds = clients.map(c => c._id)

    tokens = await helper.initTokens()
  })

  describe(`GET ${url}`, async () => {

    test("returns all projects in DB as JSON", async () =>
      await tests.getReturnsAllAsJSON(
        api, Project, url, tokens.admin))

    test("for non-admin user, returns only projects to which user is assigned", async () => {
      let res = await api
        .get(url)
        .set("authorization", `bearer ${tokens.basic}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body.length).toBe(0)

      let basicUser = await new Employee({
        username : "basic_user_with_projects",
        pwHash : "$2a$10$uceoVJPEuKxQw/i5TEo7cOkL8UzEu1ay.Fcte.pQkxGHooJEb8GOK",
        firstName : "Basic",
        lastName : "McProjectface",
        email : "basic@sauma.io",
        phone : "123456789"
      }).save()

      let token = createToken(basicUser, process.env.SECRET, process.env.HANDSHAKE)

      let projects = await Project
        .find({ $or: [
          { projectId : "my_first_project" },
          { projectId : "my_third_project" }
        ] })

      projects.map(p => p.employees = [ basicUser._id ])
      await Promise.all(projects.map(p => p.save()))

      res = await api
        .get(url)
        .set("authorization", `bearer ${token}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body.length).toBe(projects.length)
      expect(res.body.map(p => p.projectId))
        .toContain("my_first_project", "my_third_project")
    })

    test("fails if not authed, or if invalid token", async () =>
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .getFailsWithStatusCode(api, url, 401, token))))
  })

  describe(`GET ${url}/:id`, async () => {

    beforeAll(async () => {
      project = await helper.randomProject()
      path = `${url}/${project.id}`
    })

    test("with valid id returns that project as JSON", async () =>
      await tests.getReturnsOneAsJSON(
        api, Project, project, path, tokens.admin))

    test("for basic user, returns project only if assigned to that project", async () => {
      /*
       *  TBA
       */
    })

    test("fails if not authed as admin", async () =>
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .getFailsWithStatusCode(api, path, 401, token))))

    test("fails with invalid or nonexisting id", async () =>
      await Promise
        .all([ invalidId, nonExistingId ]
          .map(id => tests
            .getFailsWithStatusCode(api, id, 404, tokens.admin))))
  })

  describe(`POST ${url}`, async () => {

    test("succeeds with valid input, and returns new project as JSON", async () =>
      await tests.postReturnsNewAsJson(
        api, Project, helper.newProject(userId, clientIds), url, tokens.admin))

    test("does not affect existing projects in DB", async () =>
      await tests.postDoesNotAffectExisting(
        api, Project, helper.newProject(userId, clientIds), url, tokens.admin))

    test("fails if not authed as admin", async () => {
      project = [ helper.newProject(userId, clientIds) ]
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .postFailsWithStatusCode(api, Project, project, url, 401, token)))

      await tests.postFailsWithStatusCode(
        api, Project, project, url, 403, tokens.basic)
    })

    test("fails with invalid input", async () => {
      let projects = helper.invalidProjects(userId, clientIds)
      await tests.postFailsWithStatusCode(
        api, Project, projects, url, 400, tokens.admin)
    })

    test("cannot set non-admin employee as project manager", async () => {
      let basicUser = await Employee.findOne({ username : "basic_user" })
      project = helper.newProject(userId, clientIds)
      project.manager = basicUser._id

      await tests.postFailsWithStatusCode(
        api, Project, [ project ], url, 400, tokens.admin)
    })
  })

  describe(`PUT ${url}/:id`, async () => {

    let newClient
    let newManager

    beforeAll(async () => {
      project = await new Project(helper.newProject(userId, clientIds)).save()
      path = `${url}/${project.id}`

      newClient = await new Client(helper.newClient(userId)).save()
      newManager = await Employee.findOne({ username : "admin_user_two" })
    })

    test("succeeds with valid input, and affects only allowed fields", async () => {
      let updates = helper.updateProject(userId, newManager._id, newClient._id)
      await tests.putReturnsUpdatedAsJson(
        api, Project, project, updates, path, tokens.admin)
    })

    test("does not affect any other projects in DB", async () => {
      let updates = helper.updateProject(userId, newManager._id, newClient._id)
      await tests.putReturnsUpdatedAsJson(
        api, Project, project, updates, path, tokens.admin)
    })

    test("fails if not authed as admin", async () => {
      let updates = helper.updateProject(userId, newManager._id, newClient._id)
      await Promise
        .all([ undefined, tokens.invalid ]
          .map(token => tests
            .putFailsWithStatusCode(api, Project, [ updates ], path, 401, token)))

      await tests.putFailsWithStatusCode(
        api, Project, [ updates ], path, 403, tokens.basic)
    })

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateProject(userId, newManager._id, newClient._id)

      await Promise
        .all([ invalidId, nonExistingId ]
          .map(id => tests.putFailsWithStatusCode(
            api, Project, [ updates ], id, 404, tokens.admin)))
    })

    test("fails with invalid input", async () =>
      await tests.putFailsWithStatusCode(
        api, Project, helper.invalidProjectUpdates(userId), path, 400, tokens.admin))

    test("cannot set non-admin employee as project manager", async () => {
      let basicUser = await Employee.findOne({ username : "basic_user" })
      let updates = helper.updateProject(userId, basicUser._id, newClient._id)

      await tests.putFailsWithStatusCode(
        api, Project, [ updates ], path, 400, tokens.admin)
    })
  })
})

afterAll(() => server.close())
