const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")
const validator = require("../util/validator")

const schema = new mongoose.Schema({
  legalEntity : {
    type : String,
    required : [ true, "Legal entity name missing" ],
    trim : true
  },
  businessId : {
    type : String,
    required : [ true, "Business ID missing" ],
    trim : true
  },
  contactPerson : {
    type : String,
    required : [ true, "Contact person missing" ],
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
  createdOn : {
    type : Date,
    default : Date.now
  },
  lastEditedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : true
  }
  /*  possible additions
   *   - documentation (e.g. contracts)
   *   - saumapojat client manager (--> Employee)
   *   - associated Sites (array of Site ObjectIds)
   */
})

schema.options.toObject = {
  transform : (doc, ret) => parser.trimDbObject(ret)
}

schema.statics.overwrite = (data, client) => {
  let newValues = parser.filterByKeys([
    "address", "businessId", "contactPerson",
    "email", "legalEntity", "phone"
  ], data)
  Object.keys(newValues)
    .map(key => client[key] = newValues[key])
}

schema.statics.testAttrs = [
  "address", "businessId", "contactPerson",
  "email", "legalEntity", "phone"
]

schema.statics.updatables = [
  "address", "businessId", "contactPerson",
  "email", "lastEditedBy", "legalEntity", "phone"
]

const Client = mongoose.model("Client", schema)

module.exports = Client
