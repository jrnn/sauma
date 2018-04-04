const bcrypt = require("bcrypt")
const Employee = require("../model/employee")
const jwt = require("jsonwebtoken")
const loginRouter = require("express").Router()
const url = "/api/login"

loginRouter.post("/", async (req, res) => {
  try {
    let employee = await Employee.findOne({ username : req.body.username })

    let pwCheck = ( !employee )
      ? false
      : await bcrypt.compare(req.body.password, employee.pwHash)

    if ( !(employee && pwCheck) || !employee.enabled )
      throw new Error("Login attempt with wrong credentials")

    let { id, firstName, administrator } = employee
    let token = jwt.sign({
      handshake : process.env.HANDSHAKE,
      id,
      firstName,
      admin : administrator
    }, process.env.SECRET)

    res
      .status(200)
      .json({ token })

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(401)
      .json({ error : "Invalid username or password" })
  }
})

module.exports = loginRouter
