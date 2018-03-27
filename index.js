const express = require("express")
const app = express()
const server = require("http").createServer(app)
const config = require("./util/config")

// database
// ... TBA

// middleware
const cors = require("cors")
const bodyParser = require("body-parser")
const middleWare = require("./util/middleware")
app.use(cors())
app.use(bodyParser.json())
app.use(middleWare.logger)

// routers
const employeeRouter = require("./router/employee_router")
app.use("/api/employees", employeeRouter)

// static resources
app.use(express.static("build"))

server.listen(config.port, () =>
  console.log(`Server now listening on port ${config.port}`))

server.on("close", () =>
  // close also db connection
  console.log("Now closing server"))

module.exports = { app, server }
