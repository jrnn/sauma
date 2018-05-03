const express = require("express")
const app = express()
const server = require("http").createServer(app)
const config = require("./util/config")

// database
const mongoose = require("mongoose")
mongoose
  .connect(config.dbUri)
  .then(() =>
    console.log("Now connected to database"))
  .catch(ex =>
    console.log(ex))
mongoose.Promise = global.Promise

// static resources
app.use(express.static("build"))

if ( process.env.NODE_ENV === "production" ) {
  const enforce = require("express-sslify")
  app.use(enforce.HTTPS({ trustProtoHeader : true }))
}

// middleware and routers
const cors = require("cors")
const bodyParser = require("body-parser")
const middleWare = require("./util/middleware")
app.use(cors())
app.use(bodyParser.json())
app.use(middleWare.tokenParser)
app.use(middleWare.logger)

// api/login accessible without authentication
const loginRouter = require("./router/login_router")
app.use("/api/login", loginRouter)
app.use(middleWare.bouncer)

// unauthed reqs to all other paths are bounced
const clientRouter = require("./router/client_router")
const employeeRouter = require("./router/employee_router")
const materialRouter = require("./router/material_router")
const projectRouter = require("./router/project_router")
const taskRouter = require("./router/task_router")
app.use("/api/clients", clientRouter)
app.use("/api/employees", employeeRouter)
app.use("/api/materials", materialRouter)
app.use("/api/projects", projectRouter)
app.use("/api/tasks", taskRouter)

// and finally, centralized error handling
const { errorHandler } = require("./util/errors")
app.use(errorHandler)

server.listen(config.port, () =>
  console.log(`Server now listening on port ${config.port}`))

server.on("close", () => {
  console.log("Now closing server and connection to database")
  mongoose.connection.close()
})

module.exports = {
  app,
  server
}
