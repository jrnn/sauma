const logger = (req, res, next) => {
  if (process.env.NODE_ENV === "test")
    return next()

  console.log("Request :", req.method, req.path)
  console.log("Body    :", req.body)
  console.log("Token   :", req.token)
  console.log("------------------------")

  next()
}

const tokenParser = (req, res, next) => {
  let auth = req.get("authorization")

  if (auth && auth.toLowerCase().startsWith("bearer "))
    req.token = auth.substring(7)

  next()
}

module.exports = { logger, tokenParser }
