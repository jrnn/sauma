const loginRouter = require("express").Router()
const Employee = require("../model/employee")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const url = "/api/login"

loginRouter.post("/", async (req, res) => {
  try {
    let employee = await Employee
      .findOne({ username : req.body.username })

    let pwCheck = ( !employee )
      ? false
      : await bcrypt
        .compare(req.body.password, employee.pwHash)

    if ( !(employee && pwCheck) || !employee.enabled )
      throw new Error("Login attempt with wrong credentials")

    let { _id, username, administrator } = employee
    let token = jwt
      .sign({ id : _id, username, admin : administrator },
        process.env.SECRET)

    res
      .status(200)
      .json({ token, username })

  } catch (ex) {
    console.log(`Error @ POST ${url}`, ex.message)
    res
      .status(401)
      .send({ error : "Invalid username or password" })
  }
})

module.exports = loginRouter
