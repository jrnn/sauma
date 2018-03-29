const parseErrors = (validationResult) => {
  let errors = []

  Object.keys(validationResult).forEach(key =>
    errors.push(validationResult[key].message))

  return errors
}

const validateEmail = (email) => {
  let regExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9-]+(\.[a-z0-9]+)*(\.[a-z]{2,})$/

  return regExp.test(String(email).trim().toLowerCase())
}

const validatePassword = (password) => {
  let allowedChrs = /^[A-Za-z0-9!#$%&'*+.:,;/=?@^_~-]+$/
  let minimumReqs = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,})/

  return allowedChrs.test(String(password))
      && minimumReqs.test(String(password))
}

const validatePhone = (phone) => {
  let regExp = /^\d{2,3}[ -]?(\d{3}[ -]?\d{4}|\d{4}[ -]?\d{3})$/

  return regExp.test(String(phone).trim())
}

module.exports = {
  parseErrors, validateEmail, validatePassword, validatePhone
}
