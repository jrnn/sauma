const bcrypt = require("bcrypt")
const { isEmptyObject } = require("./parser")
const { validatePassword } = require("./validator")

const checkPassword = async (password, employee) =>
  ( !password || !employee )
    ? false
    : await bcrypt.compare(password, employee.pwHash)

const checkNewPassword = async (passwords, employee) => {
  let errors = {}
  let { password, newPassword, confirmPassword } = passwords
  let pwCheck = await checkPassword(password, employee)

  if ( !pwCheck )
    errors.password = "Virheellinen salasana"

  if ( !validatePassword(newPassword) )
    errors.newPassword = "Uusi salasana ei täytä vaatimuksia"

  if ( String(newPassword) !== String(confirmPassword) )
    errors.newPassword = "Salasanat eivät täsmää"

  return ( isEmptyObject(errors) )
    ? undefined
    : errors
}

const createToken = (employee, key, handshake) =>
  require("jsonwebtoken").sign({
    handshake,
    id : employee._id,
    admin : employee.administrator
  }, key)

const hashPassword = async (password) => {
  if ( !validatePassword(password) )
    return undefined
  else
    return await bcrypt
      .hash(password, Number(process.env.BCRYPT_COST))
}

module.exports = {
  checkPassword,
  checkNewPassword,
  createToken,
  hashPassword
}
