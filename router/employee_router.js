const Employee = require("../model/employee")
const employeeRouter = require("express").Router()
const helper = require("./router_helper")
const url = "/api/employees"

employeeRouter.get("/", async (req, res) => {
  try {
    if ( !req.auth ) return res
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
    if ( !req.auth ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    let employee = await Employee.findById(req.params.id)
    if ( employee ) res
      .json(employee)
    else res
      .status(404).end()

  } catch (ex) {
    console.log(`Error @ GET ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

employeeRouter.post("/", async (req, res) => {
  try {
    if ( !req.auth || !req.auth.admin ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    let { employee, errors } = await helper
      .validateEmployee(req.body, true)
    if (errors.length > 0)
      throw ({ message : errors })

    employee = await employee.save()
    res
      .status(201)
      .json(employee)

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = employeeRouter
