const mongoose = require("mongoose")

const address = new mongoose.Schema({
  street : {
    type : String,
    required : [ true, "Katuosoite puuttuu" ],
    trim : true
  },
  streetExt : {
    type : String,
    trim : true
  },
  zipCode : {
    type : String,
    required : [ true, "Postinumero puuttuu" ],
    maxlength : [ 10, "Korkeintaan 10 merkkiä" ],
    trim : true
  },
  city : {
    type : String,
    required : [ true, "Kaupunki puuttuu" ],
    trim : true
  },
  country : {
    type : String,
    required : [ true, "Valtio puuttuu" ],
    trim : true
  }
})

address.options.toJSON = {
  transform : (doc, ret) => {
    delete ret._id
    return ret
  }
}

const quota = new mongoose.Schema({
  material : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Material",
    required : [ true, "Nimike puuttuu" ]
  },
  quantity : {
    type : Number,
    required : [ true, "Määrä puuttuu" ],
    min : 0
  }
})

quota.options.toJSON = {
  transform : (doc, ret) => {
    delete ret._id
    return ret
  }
}

module.exports = {
  address,
  quota
}
