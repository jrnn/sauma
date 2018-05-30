const mongoose = require("mongoose")
const parser = require("../util/parser")

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

const attachment = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    trim : true
  },
  key : {
    type : String,
    required : true
  },
  url : {
    type : String,
    required : true
  },
  createdOn : {
    type : Date,
    default : Date.now
  },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : true
  }
})

attachment.options.toJSON = {
  transform : (doc, ret) => {
    delete ret._id
    return ret
  }
}

const comment = new mongoose.Schema({
  text : {
    type : String,
    required : true,
    maxlength : [ 255, "Korkeintaan 255 merkkiä" ],
    trim : true
  },
  createdOn : {
    type : Date,
    default : Date.now
  },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : true
  }
})

comment.options.toJSON = {
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
    min : 0,
    set : parser.round2dp
  }
})

quota.options.toJSON = {
  transform : (doc, ret) => {
    delete ret._id
    ret.quantity = String(ret.quantity)
    return ret
  }
}

module.exports = {
  address,
  attachment,
  comment,
  quota
}
