const jwt = require("jsonwebtoken")
const path = require("path")

const bouncer = (req, res, next) => {
  if ( isApiRequest(req) && !req.auth ) {
    return res
      .status(401)
      .json({ error : "Invalid credentials" })
  }

  next()
}

const catchAll = (req, res) => {
  if ( isApiRequest(req) )
    res
      .status(404)
      .json({ error : "Resource not found" })
  else
    res
      .sendFile(`${path.resolve(".")}/build/index.html`)
}

const logger = (req, res, next) => {
  if ( process.env.NODE_ENV !== "development" )
    return next()

  console.log("Request :", req.method, req.path)
  console.log("Body    :", req.body)
  console.log("Auth    :", req.auth)
  console.log("------------------------")

  next()
}

const isApiRequest = (req) =>
  ( req.originalUrl.substring(0, 5) === "/api/" )

const tokenParser = (req, res, next) => {
  let auth = req.get("authorization")

  if ( !auth || !auth.toLowerCase().startsWith("bearer ") )
    return next()

  try {
    let token = jwt.verify(auth.substring(7), process.env.SECRET)

    if ( token.handshake === process.env.HANDSHAKE )
      req.auth = token

  } catch (ex) { req.auth = undefined }

  next()
}

module.exports = {
  bouncer,
  catchAll,
  logger,
  tokenParser
}
