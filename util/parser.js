const filterByKeys = (allowedKeys, obj, res = {}) => {
  allowedKeys
    .filter(key => obj[key])
    .map(key => res = { ...res, [key] : obj[key] })
  return res
}

const formatPhone = (phone) => {
  let s = ""
  let allowedChars = /\d|[ -]/

  for (let c of String(phone)) {
    if (!allowedChars.test(c))
      return phone
    if (/\d/.test(c))
      s += c
  }

  switch (s.length) {
    case 10 :
      return s.substring(0, 3) + "-" + s.substring(3, 6) + "-" + s.substring(6)
    case 8 : case 9 :
      return s.substring(0, 2) + "-" + s.substring(2, 5) + "-" + s.substring(5)
    default :
      return phone
  }
}

const parseValidationErrors = (obj) => {
  let res = obj.validateSync()
  return ( !res )
    ? []
    : Object.keys(res.errors)
      .filter(key => res.errors[key].path)
      .map(key => res.errors[key].message)
}

const trimDbObject = (obj) => {
  obj.id = obj._id

  delete obj._id
  delete obj.__v

  return obj
}

module.exports = {
  filterByKeys, formatPhone, parseValidationErrors, trimDbObject
}
