const env = process.env.NODE_ENV

if ( env !== "production" ) {
  require("dotenv").config()
}

const dbUri = process.env.DB_URI
const port = process.env.PORT
const mongoOpts = {
  promiseLibrary: global.Promise,
  useNewUrlParser: true
}

module.exports = {
  dbUri,
  env,
  mongoOpts,
  port
}
