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

const toJSONCommon = (doc) => {
  doc.id = doc._id

  delete doc._id
  delete doc.__v

  return doc
}

module.exports = { formatPhone, toJSONCommon }