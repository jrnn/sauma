const mongoose = require("mongoose")
const { validateEmail, validatePhone } = require("../util/validator")

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
      validator : validateEmail,
      message : "Invalid email"
    }
  },
  phone : {
    type : String,
    required : [ true, "Phone number missing" ],
    validate : {
      validator : validatePhone,
      message : "Invalid phone number"
    },
    trim : true
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

schema.options.toJSON = {
  transform : (employee) => {
    employee = employee._doc
    employee.id = employee._id

    delete employee.pwHash
    delete employee.__v
    delete employee._id

    return employee
  }
}

const Employee = mongoose.model("Employee", schema)

module.exports = Employee
