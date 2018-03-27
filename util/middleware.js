const logger = (req, res, next) => {
  if (process.env.NODE_ENV === "test")
    return next()

  console.log("Method :", req.method)
  console.log("Path   :", req.path)
  console.log("Body   :", req.body)
  console.log("Token  :", req.token)
  console.log("------------------------")

  next()
}

module.exports = { logger }
