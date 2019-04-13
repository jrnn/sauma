const express = require("express")
const mongoose = require("mongoose")

const app = express()
const { dbUri, env, mongoOpts, port } = require("./util/config")
const { bouncer, catchAll, logger, tokenParser } = require("./util/middleware")

// static resources
app.use(express.static("build"))

// enforce HTTPS connections
if ( env === "production" ) {
  const enforce = require("express-sslify")
  app.use(enforce.HTTPS({ trustProtoHeader : true }))
}

// middleware and routers
app.use(require("cors")())
app.use(express.json())
app.use(tokenParser)
app.use(logger)

// api/login accessible without authentication
app.use("/api/login", require("./router/login"))

// unauthed reqs to all other API paths are bounced
app.use(bouncer)
app.use("/api/activities", require("./router/activity"))
app.use("/api/blobs",      require("./router/blob"))
app.use("/api/comments",   require("./router/comment"))
app.use("/api/clients",    require("./router/client"))
app.use("/api/employees",  require("./router/employee"))
app.use("/api/materials",  require("./router/material"))
app.use("/api/projects",   require("./router/project"))
app.use("/api/tasks",      require("./router/task"))

// centralized error handling
const { errorHandler } = require("./util/errors")
app.use(errorHandler)

// and finally, catch-all route that returns 404 for unknown
// API routes, or otherwise just serves frontend index
app.get("*", catchAll)

if ( env !== "test" ) {
  app.listen(port, () => {
    console.log(`Server now listening on port ${port} in ${env} mode`)
    mongoose
      .connect(dbUri, mongoOpts)
      .then(() => console.log("Now connected to database"))
      .catch(error => {
        console.error(error)
        process.exit(1)
      })
  })

  app.on("close", () => {
    console.log("Now closing server and connection to database")
    mongoose.disconnect()
  })
}

module.exports = { app }
