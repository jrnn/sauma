const parseErrors = (validationErrors) => {
  let errors = []

  Object.keys(validationErrors)
    .filter(key => validationErrors[key].path)
    .map(key => errors.push(validationErrors[key].message))

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
  let regExp = /(^\d{2}-\d{3}-\d{3,4}$)|(^\d{3}-\d{3}-\d{4}$)/
  return regExp.test(String(phone))
}

module.exports = {
  parseErrors, validateEmail, validatePassword, validatePhone
}
