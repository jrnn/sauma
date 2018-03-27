const employeeRouter = require("express").Router()

employeeRouter.get("/", async (req, res) => {
  try {
    res
      .status(200)
      .send({ message : "Hello saumaworld!" })

  } catch (ex) {
    console.log("Error @ GET /api/employees :", ex.message)

    res
      .status(400)
      .send({ message : ex.message })
  }
})

module.exports = employeeRouter
