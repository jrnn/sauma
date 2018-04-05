const mongoose = require("mongoose")

const address = new mongoose.Schema({
  street : {
    type : String,
    required : [ true, "Street address missing" ],
    trim : true
  },
  streetExt : {
    type : String,
    trim : true
  },
  zipCode : {
    type : String,
    required : [ true, "Postal code missing" ],
    maxlength : [ 10, "Postal code must not exceed 10 characters" ],
    trim : true
  },
  city : {
    type : String,
    required : [ true, "City missing" ],
    trim : true
  },
  country : {
    type : String,
    required : [ true, "Country missing" ],
    trim : true
  }
})

address.options.toObject = {
  transform : (doc, ret) => {
    delete ret._id
    return ret
  }
}

module.exports = { address }
