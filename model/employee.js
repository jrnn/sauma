const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")
const validator = require("../util/validator")

const schema = new mongoose.Schema({
  username : {
    type : String,
    required : [ true, "Username missing" ],
    minlength : [ 4, "Username must be at least 4 characters long" ],
    trim : true
  },
  pwHash : { type : String },
  firstName : {
    type : String,
    required : [ true, "First name missing" ],
    trim : true
  },
  lastName : {
    type : String,
    required : [ true, "Last name missing" ],
    trim : true
  },
  email : {
    type : String,
    required : [ true, "Email missing" ],
    lowercase : true,
    trim : true,
    validate : {
      validator : validator.validateEmail,
      message : "Invalid email"
    }
  },
  phone : {
    type : String,
    required : [ true, "Phone number missing" ],
    set : parser.formatPhone,
    validate : {
      validator : validator.validatePhone,
      message : "Invalid phone number"
    }
  },
  address : { type : schemas.address },
  enabled : {
    type : Boolean,
    default : true
  },
  administrator : {
    type : Boolean,
    default : false
  },
  createdOn : {
    type : Date,
    default : Date.now
  }
  /*  possible additions
   *   - more detailed authorities/privileges (array of Strings?)
   *   - labour cost/hour
   *   - "perehdytykset" (array of Site ObjectIds?)
   *   - associated Sites (-- '' --)
   */
})

schema.options.toObject = {
  transform : (doc, ret) => parser.trimDbObject(ret)
}

schema.options.toJSON = {
  transform : (doc, ret) => {
    ret = parser.trimDbObject(ret)
    delete ret.pwHash
    return ret
  }
}

schema.statics.overwrite = (data, employee) => {
  let newValues = parser.filterByKeys([
    "administrator", "address", "email", "enabled",
    "firstName", "lastName", "phone", "username"
  ], data)
  Object.keys(newValues)
    .map(key => employee[key] = newValues[key])
}

schema.statics.testAttrs = [
  "address", "email", "firstName", "lastName", "phone", "username"
]

schema.statics.updatables = [
  "administrator", "address", "email", "enabled",
  "firstName", "lastName", "phone", "username"
]

const Employee = mongoose.model("Employee", schema)

module.exports = Employee
