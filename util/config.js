const env = process.env.NODE_ENV

if ( env !== "production" ) {
  require("dotenv").config()
}

const dbUri = process.env.DB_URI
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY
const port = process.env.PORT
const mongoOpts = {
  promiseLibrary: global.Promise,
  useNewUrlParser: true
}

module.exports = {
  dbUri,
  env,
  googleApiKey,
  mongoOpts,
  port
}
