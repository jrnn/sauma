const mongoose = require("mongoose")
const { validateEmail, validatePhone } = require("../util/validator")

const schema = new mongoose.Schema({
  username : {
    type : String,
    required : [ true, "Käyttäjänimi puuttuu" ],
    minlength : [ 4, "Käyttäjänimen oltava vähintään 4 merkkiä" ],
    trim : true
  },
  pwHash : {
    type : String,
    default : undefined  // TBA
  },
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
      validator : validateEmail,
      message : "Virheellinen email"
    }
  },
  phone : {
    type : String,
    required : [ true, "Puhelinnumero puuttuu" ],
    validate : {
      validator : validatePhone,
      message : "Virheellinen puhelinnumero"
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

const Employee = mongoose.model("Employee", schema)

module.exports = Employee
