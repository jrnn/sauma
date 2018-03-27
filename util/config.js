if (process.env.NODE_ENV !== "production")
  require("dotenv").config()

let port = process.env.PORT
let dbUri = process.env.DB_URI

if (process.env.NODE_ENV === "test") {
  port = process.env.PORT_TEST
  dbUri = process.env.DB_URI_TEST // not sure if needed if not using actual db for tests?
}

module.exports = { port, dbUri }
