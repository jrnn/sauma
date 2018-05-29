let env = process.env.NODE_ENV

if ( env !== "production" )
  require("dotenv").config()

let port = ( env === "test" )
  ? process.env.PORT_TEST
  : process.env.PORT
let dbUri = ( env === "test" )
  ? process.env.DB_URI_TEST
  : process.env.DB_URI

module.exports = {
  port,
  dbUri
}
