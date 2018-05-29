const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  uuid : {
    type : String,
    required : true
  },
  employee : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : true
  },
  createdOn : {
    type : Date,
    default : Date.now
  }
})

schema.statics.isValid = (tokenDate) =>
  // tokens are valid for 24 hours (i.e. 86 400 000 ms)
  ( Date.now() < (Date.parse(tokenDate) + 86400000) )

const VerificationToken = mongoose.model("VerificationToken", schema)

module.exports = VerificationToken
