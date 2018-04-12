const bcrypt = require("bcrypt")
const validator = require("../util/validator")

const createToken = (employee, key, handshake) =>
  require("jsonwebtoken").sign({
    handshake,
    id : employee._id,
    admin : employee.administrator
  }, key)

const hashPassword = async (password) => {
  if ( !validator.validatePassword(password) )
    return undefined
  else
    return await bcrypt
      .hash(password, Number(process.env.BCRYPT_COST))
}

module.exports = {
  createToken,
  hashPassword
}
