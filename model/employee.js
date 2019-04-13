const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")
const validator = require("../util/validator")

const schema = new mongoose.Schema({
  username : {
    type : String,
    required : [ true, "Käyttäjätunnus puuttuu" ],
    minlength : [ 4, "Pituus oltava vähintään 4 merkkiä" ],
    trim : true
  },
  pwHash : { type : String },
  firstName : {
    type : String,
    required : [ true, "Etunimi puuttuu" ],
    trim : true
  },
  lastName : {
    type : String,
    required : [ true, "Sukunimi puuttuu" ],
    trim : true
  },
  email : {
    type : String,
    required : [ true, "Email puuttuu" ],
    lowercase : true,
    trim : true,
    validate : {
      validator : validator.validateEmail,
      message : "Virheellinen email"
    }
  },
  phone : {
    type : String,
    required : [ true, "Puhelin puuttuu" ],
    set : parser.formatPhone,
    validate : {
      validator : validator.validatePhone,
      message : "Virheellinen numero"
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
  projects : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Project"
    }
  ],
  createdOn : {
    type : Date,
    default : Date.now
  }
})

schema.options.toJSON = {
  transform : (doc, ret) => {
    ret = parser.trimDbObject(ret)
    delete ret.pwHash
    return ret
  }
}

schema.pre("validate", async function (next) {
  if ( this.isNew && !this.pwHash )
    this.invalidate(
      "pwHash", "Salasana ei täytä vaatimuksia", this.pwHash)

  let count = await this.model("Employee")
    .countDocuments({ username : this.username })
    .where({ _id : { $ne : this._id } })
  if ( count > 0 )
    this.invalidate(
      "username", "Käyttäjänimi on varattu", this.username)

  count = await this.model("Employee")
    .countDocuments({ email : this.email })
    .where({ _id : { $ne : this._id } })
  if ( count > 0 )
    this.invalidate(
      "email", "Email on varattu", this.email)

  next()
})

schema.statics.overwrite = (employee, data, isAdmin = false) => {
  let keys = [
    "administrator", "address", "email", "enabled",
    "firstName", "lastName", "phone", "username"
  ]
  if ( !isAdmin ) keys = keys
    .filter(key => key !== "administrator" && key !== "enabled")

  let newValues = parser.filterByKeys(keys, data)
  Object
    .keys(newValues)
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
