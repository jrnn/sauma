const express = require("express")
const app = express()
const server = require("http").createServer(app)
const config = require("./util/config")

// database
const mongoose = require("mongoose")
mongoose
  .connect(config.dbUri)
  .then(() => console.log("Now connected to database"))
  .catch(ex => console.log(ex))
mongoose.Promise = global.Promise

// static resources
app.use(express.static("build"))

// enforce HTTPS connections
if ( process.env.NODE_ENV === "production" ) {
  const enforce = require("express-sslify")
  app.use(enforce.HTTPS({ trustProtoHeader : true }))
}

// middleware and routers
const middleware = require("./util/middleware")
app.use(require("cors")())
app.use(require("body-parser").json())
app.use(middleware.tokenParser)
app.use(middleware.logger)

// api/login accessible without authentication
app.use("/api/login", require("./router/login"))
app.use(middleware.bouncer)

// unauthed reqs to all other paths are bounced
app.use("/api/activities", require("./router/activity"))
app.use("/api/blobs",      require("./router/blob"))
app.use("/api/clients",    require("./router/client"))
app.use("/api/employees",  require("./router/employee"))
app.use("/api/materials",  require("./router/material"))
app.use("/api/projects",   require("./router/project"))
app.use("/api/tasks",      require("./router/task"))

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
