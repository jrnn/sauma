const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")
const validator = require("../util/validator")

const schema = new mongoose.Schema({
  businessId : {
    type : String,
    required : [ true, "Y-tunnus puuttuu" ],
    trim : true
  },
  legalEntity : {
    type : String,
    required : [ true, "Toiminimi puuttuu" ],
    trim : true
  },
  contactPerson : {
    type : String,
    required : [ true, "Yhteyshenkilö puuttuu" ],
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
  attachments : [{ type : schemas.attachment }],
  createdOn : {
    type : Date,
    default : Date.now
  },
  lastEditedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : true
  }
})

schema.pre("validate", async function (next) {
  let count = await this.model("Client")
    .count({ businessId : this.businessId })
    .where({ _id : { $ne : this._id } })
  if ( count > 0 )
    this.invalidate(
      "businessId", "Y-tunnus on jo käytössä", this.businessId)

  next()
})

schema.options.toJSON = {
  transform : (doc, ret) => parser.trimDbObject(ret)
}

schema.statics.overwrite = (client, data, isAdmin = false) => {
  let newValues = parser.filterByKeys([
    "address", "attachments", "businessId",
    "contactPerson", "email", "legalEntity", "phone"
  ], data)
  Object
    .keys(newValues)
    .map(key => client[key] = newValues[key])
}

schema.statics.testAttrs = [
  "address", "businessId", "contactPerson",
  "email", "legalEntity", "phone"
]

schema.statics.updatables = [
  "address", "attachments", "businessId", "contactPerson",
  "email", "lastEditedBy", "legalEntity", "phone"
]

const Client = mongoose.model("Client", schema)

module.exports = Client
