const jwt = require("jsonwebtoken")

const logger = (req, res, next) => {
  if (process.env.NODE_ENV === "test")
    return next()

  console.log("Request :", req.method, req.path)
  console.log("Body    :", req.body)
  console.log("Auth    :", req.auth)
  console.log("------------------------")

  next()
}

const tokenParser = (req, res, next) => {
  let auth = req.get("authorization")

  if (!auth || !auth.toLowerCase().startsWith("bearer "))
    return next()

  try {
    let token = jwt.verify(auth.substring(7), process.env.SECRET)

    if ( token.handshake === process.env.HANDSHAKE ) {
      delete token.handshake
      req.auth = token
    }
  } catch (ex) { req.auth = undefined }

  next()
}

module.exports = {
  logger,
  tokenParser
}
