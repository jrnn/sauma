const { app, server } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

const { createToken } = require("../util/auth")
const Client = require("../model/client")
const Employee = require("../model/employee")
const Project = require("../model/project")
const helper = require("./api_test_helper")
const Task = require("../model/task")
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
    await helper.initMaterials()
    await helper.initClients()
    await helper.initProjects()
    await helper.initTasks()

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
      path = `${url}/${project._id}`
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

    test("for non-admin user, returns project only if assigned to that project", async () => {
      let employee = await Employee
        .findOne({ projects : project._id })

      let employees = await Employee
        .find({ administrator : false })
        .where({ _id : { $ne : employee._id } })

      await tests
        .getReturnsOneAsJSON(
          api,
          Project,
          project,
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

      let client = helper.newClient()
      client.lastEditedBy = adminId
      client = await new Client(client).save()

      let newManager = await Employee
        .findOne({ username : "admin2" })

      clientId = client._id
      managerId = newManager._id
      path = `${url}/${project._id}`
    })

    test("succeeds with valid input, and affects only allowed fields", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Project,
          project,
          helper.updateProject(managerId, clientId),
          path,
          tokens.admin
        ))

    test("does not affect any other projects in DB", async () =>
      await tests
        .putReturnsUpdatedAsJson(
          api,
          Project,
          project,
          helper.updateProject(managerId, clientId),
          path,
          tokens.admin
        ))

    test("fails if invalid token", async () => {
      let updates = helper.updateProject(managerId, clientId)

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
          [ helper.updateProject(managerId, clientId) ],
          path,
          403,
          tokens.basic
        ))

    test("fails with invalid or nonexisting id", async () => {
      let updates = helper.updateProject(managerId, clientId)

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
          helper.invalidProjectUpdates(),
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
          [ helper.updateProject(basicUser._id, clientId) ],
          path,
          400,
          tokens.admin
        )
    })
  })

  describe(`GET ${url}/:id/tasks`, async () => {

    test("returns only tasks that belong to project in question", async () => {
      let projects = await Project.find()

      await Promise
        .all(projects
          .map(async (p) => {
            let tasks = await Task
              .find({ project : p._id })

            let res = await api
              .get(`${url}/${p._id}/tasks`)
              .set("authorization", `bearer ${tokens.admin}`)
              .expect(200)
              .expect("content-type", /application\/json/)

            expect(res.body.length).toBe(tasks.length)
            tasks.map(t => expect(t.project).toEqual(p._id))
          }))
    })

    test("for non-admin user, returns tasks only if assigned to the parent project", async () => {
      let user = await Employee
        .findOne({ administrator : false })
        .where({ projects : { $ne : [] } })

      project = await Project
        .findOne({ _id : { $in : user.projects } })

      let tasks = await Task
        .find({ project : project._id })

      let token = createToken(
        user, process.env.SECRET, process.env.HANDSHAKE)

      let res = await api
        .get(`${url}/${project._id}/tasks`)
        .set("authorization", `bearer ${token}`)
        .expect(200)
        .expect("content-type", /application\/json/)

      expect(res.body.length).toBe(tasks.length)
      tasks.map(t => expect(t.project).toEqual(project._id))

      let users = await Employee
        .find({ administrator : false })
        .where({ projects : { $ne : project._id } })

      await Promise
        .all(users
          .map(u => tests
            .getFailsWithStatusCode(
              api,
              `${url}/${project._id}/tasks`,
              403,
              createToken(u, process.env.SECRET, process.env.HANDSHAKE)
            )))
    })

    test("fails if invalid or nonexisting id", async () =>
      await Promise
        .all(invalidIds
          .map(id => tests
            .getFailsWithStatusCode(
              api,
              `${id}/tasks`,
              404,
              tokens.admin
            ))))
  })

  describe(`POST ${url}/:id/employees`, async () => {

    let employee

    beforeAll(async () => {
      employee = await helper.randomEmployee()
      project = await helper.randomProject()
    })

    const assignEmployeeToProject = async (projectBefore, employeeBefore) => {
      await api
        .post(`${url}/${projectBefore._id}/employees`)
        .set("authorization", `bearer ${tokens.admin}`)
        .send({ id : employeeBefore._id })
        .expect(200)
        .expect("content-type", /application\/json/)

      let projectAfter = await Project
        .findById(projectBefore._id)

      let employeeAfter = await Employee
        .findById(employeeBefore._id)

      expect(projectAfter.employees
        .map(id => id.toString()))
        .toContain(employeeAfter._id.toString())

      expect(employeeAfter.projects
        .map(id => id.toString()))
        .toContain(projectAfter._id.toString())

      Employee.testAttrs.map(attr =>
        expect(JSON.stringify(employeeBefore[attr]))
          .toEqual(JSON.stringify(employeeAfter[attr])))

      Project.testAttrs.map(attr =>
        expect(JSON.stringify(projectBefore[attr]))
          .toEqual(JSON.stringify(projectAfter[attr])))

      return { employeeAfter, projectAfter }
    }

    test("succeeds with valid input, and affects only related fields", async () => {
      project = await helper.randomProject()
      employee = await Employee
        .findOne({ projects : { $ne : project._id } })

      await assignEmployeeToProject(project, employee)
    })

    test("cannot assign same employee twice to one project", async () => {
      project = await helper.randomProject()
      employee = await Employee
        .findOne({ projects : { $ne : project._id } })

      await assignEmployeeToProject(project, employee)

      let { employeeAfter, projectAfter } =
        await assignEmployeeToProject(project, employee)

      expect(employeeAfter.projects.length)
        .toBe(employee.projects.length + 1)

      expect(projectAfter.employees.length)
        .toBe(project.employees.length + 1)
    })

    test("can assign more than one employee to one project", async () => {
      let employees = await Employee
        .find({ administrator : false })
        .limit(3)

      project = await new Project(
        helper.newProject(adminId, clientIds)).save()

      expect(project.employees.length).toBe(0)

      await assignEmployeeToProject(project, employees[0])
      await assignEmployeeToProject(project, employees[1])

      let { projectAfter } = await assignEmployeeToProject(
        project, employees[2])

      expect(projectAfter.employees.length).toBe(3)
    })

    test("fails if invalid project id or employee id", async () => {
      await tests
        .postFailsWithStatusCode(
          api,
          Project,
          [{ id : employee._id }],
          `${url}/${new Project()._id}/employees`,
          404,
          tokens.admin)

      await tests
        .postFailsWithStatusCode(
          api,
          Project,
          [
            undefined,
            { id : new Employee()._id },
            { id : "this_is_not_a_valid_id" }
          ],
          `${url}/${project._id}/employees`,
          404,
          tokens.admin)
    })

    test("fails if invalid token", async () =>
      await Promise
        .all(tokens.invalid
          .map(token => tests
            .postFailsWithStatusCode(
              api,
              Project,
              [{ id : employee._id }],
              `${url}/${project._id}/employees`,
              401,
              token
            ))))

    test("fails if not authed as admin", async () =>
      await tests
        .postFailsWithStatusCode(
          api,
          Project,
          [{ id : employee._id }],
          `${url}/${project._id}/employees`,
          403,
          tokens.basic
        ))
  })
})

afterAll(() => server.close())
