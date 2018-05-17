const AuthenticationError = () => {
  let error = new Error("Invalid username or password")
  error.name = "AuthenticationError"
  error.statusCode = 401

  return error
}

const AuthorizationError = () => {
  let error = new Error("You do not have permission to this resource")
  error.name = "AuthorizationError"
  error.statusCode = 403

  return error
}

const CustomError = (name, message, statusCode) => {
  let error = new Error(message)
  error.name = name
  error.statusCode = statusCode

  return error
}

const FauxValidationError = (errors) => {
  let error = new Error()
  error.name = "FauxValidationError"
  error.statusCode = 400
  error.errors = errors

  return error
}

const errorHandler = (error, req, res, next) => {
  if ( process.env.NODE_ENV === "development" )
    console.log(error)

  switch ( error.name ) {
    case "ValidationError" :
      return res
        .status(400)
        .json({ ValidationError : parseValidationErrors(error) })
    case "FauxValidationError" :
      return res
        .status(400)
        .json({ ValidationError : error.errors })
    case "AuthorizationError" :
      return res
        .status(403)
        .json({ error : "You do not have permission to that resource" })
    case "TypeError" :
    case "CastError" :
    case "MissingSchemaError" :
      return res
        .status(404)
        .json({ error : "Resource not found" })
    default :
      return res
        .status(error.statusCode || 500)
        .json({ error : error.message })
  }
}

const parseValidationErrors = (error, res = {}) => {
  let { errors } = error

  Object
    .keys(errors)
    .filter(key => errors[key].path)
    .map(key => {
      let message = ( errors[key].name === "CastError" )
        ? "Vääränlainen syöte"
        : errors[key].message
      res = { ...res, [key] : message }
    })

  return res
}

module.exports = {
  AuthenticationError,
  AuthorizationError,
  CustomError,
  FauxValidationError,
  errorHandler
}
