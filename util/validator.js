const validateEmail = (email) => {
  let re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9-]+(\.[a-z0-9]+)*(\.[a-z]{2,})$/
  return re.test(String(email).trim().toLowerCase())
}

const validatePhone = (phone) => {
  let re = /^\d{2,3}[ -]?(\d{3}[ -]?\d{4}|\d{4}[ -]?\d{3})$/
  return re.test(String(phone).trim())
}

module.exports = { validateEmail, validatePhone }
