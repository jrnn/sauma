const bcrypt = require("bcrypt")
const { createToken } = require("../service/auth_service")
const Employee = require("../model/employee")
const loginRouter = require("express").Router()
const url = "/api/login"

loginRouter.post("/", async (req, res) => {
  try {
    let { username, password } = req.body
    let employee = await Employee.findOne({ username })

    let pwCheck = ( !employee )
      ? false
      : await bcrypt.compare(password, employee.pwHash)

    if ( !(employee && pwCheck) || !employee.enabled )
      throw new Error("Login attempt with wrong credentials")

    let token = createToken(employee, process.env.SECRET, process.env.HANDSHAKE)
    let auth = {
      admin : employee.administrator,
      firstName : employee.firstName,
      id : employee._id,
      token
    }
    res
      .status(200)
      .json(auth)

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(401)
      .json({ error : "Invalid username or password" })
  }
})

module.exports = loginRouter
