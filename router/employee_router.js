const Employee = require("../model/employee")
const employeeRouter = require("express").Router()
const service = require("../service/employee_service")
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

    let { employee, errors } = await service
      .validateNew(req.body)
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

employeeRouter.put("/:id", async (req, res) => {
  try {
    if ( !req.auth ) return res
      .status(401)
      .json({ error : "Invalid or inadequate credentials" })

    let original = await Employee.findById(req.params.id)

    if ( !req.auth.admin && req.auth.id !== original.id )
      return res
        .status(401)
        .json({ error : "Invalid or inadequate credentials" })

    let { employee, errors } = await service
      .validateExisting(req.body, original, req.auth.admin)
    if (errors.length > 0)
      throw ({ message : errors })

    let updated = await Employee
      .findByIdAndUpdate(req.params.id, employee, { new : true })

    if ( !updated ) res
      .status(404).end()
    else res
      .json(updated)

  } catch (ex) {
    console.log(`Error @ PUT ${url}/${req.params.id}`, ex.message)
    res
      .status(400)
      .json({ error : ex.message })
  }
})

module.exports = employeeRouter
