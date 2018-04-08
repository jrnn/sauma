const Employee = require("../model/employee")
const employeeRouter = require("express").Router()
const { hashPassword } = require("../service/auth_service")
const parser = require("../util/parser")
const url = "/api/employees"

employeeRouter.get("/", async (req, res) => {
  try {
    if ( !req.auth )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    let employees = await Employee.find()
    res.json(employees)

  } catch (ex) {
    console.log(`Error @ GET ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

employeeRouter.get("/:id", async (req, res) => {
  try {
    if ( !req.auth )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    let employee = await Employee.findById(req.params.id)
    if ( employee ) res.json(employee)
    else
      res
        .status(404)
        .end()

  } catch (ex) {
    console.log(`Error @ GET ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

employeeRouter.post("/", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    req.body.pwHash = await hashPassword(req.body.password)
    let employee = await new Employee(req.body).save()
    res
      .status(201)
      .json(employee)

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

employeeRouter.put("/:id", async (req, res) => {
  try {
    if ( !req.auth )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    let employee = await Employee.findById(req.params.id)
    if ( !employee )
      return res
        .status(404)
        .end()

    if ( !req.auth.admin && req.auth.id !== employee.id )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    Employee.overwrite(employee, req.body, req.auth.admin)
    let updated = await employee.save()
    res.json(updated)

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`Error @ PUT ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = employeeRouter
