const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  data : {
    type : Buffer,
    required : true
  },
  mime : {
    type : String,
    required : true
  },
  name : {
    type : String,
    required : true
  },
  size : {
    type : Number,
    required : true,
    min : 1
  }
})

const Blob = mongoose.model("Blob", schema)

module.exports = Blob
