const mongoose = require("mongoose")
const parser = require("../util/parser")
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
    // validation possible for Finnish Y-tunnus at least ...
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
  /*
  address : {
    street : String,
    streetExt : String,
    zipCode : String,
    city : String,
    country : String
  },
  */
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

const Client = mongoose.model("Client", schema)

module.exports = Client
