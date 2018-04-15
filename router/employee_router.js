const Employee = require("../model/employee")
const employeeRouter = require("express").Router()
const { hashPassword } = require("../service/auth_service")
const parser = require("../util/parser")
const url = "/api/employees"

employeeRouter.get("/", async (req, res) => {
  try {
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
    if ( !req.auth.admin )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    // temporary bullshit arrangement just for dev purposes
    // should be  ... await hashPassword(req.body.password)
    req.body.pwHash = await hashPassword("Qwerty_123")

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
      .json({ [ex.name] : ex.message })
  }
})

employeeRouter.put("/:id", async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id)
    if ( !employee )
      return res
        .status(404)
        .end()

    if ( !req.auth.admin && req.auth.id !== employee.id )
      return res
        .status(403)
        .json({ error : "You do not have permission to this resource" })

    Employee.overwrite(employee, req.body, req.auth.admin)
    let updated = await employee.save()
    res.json(updated)

  } catch (ex) {
    if ( ex.name === "ValidationError" )
      ex.message = await parser.parseValidationErrors(ex)

    console.log(`Error @ PUT ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ [ex.name] : ex.message })
  }
})

module.exports = employeeRouter
