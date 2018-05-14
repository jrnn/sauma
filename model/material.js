const mongoose = require("mongoose")
const parser = require("../util/parser")

const schema = new mongoose.Schema({
  name : {
    type : String,
    required : [ true, "Nimike puuttuu" ],
    trim : true
  },
  color : {
    type : String,
    trim : true
  },
  unit : {
    type : String,
    required : [ true, "Mittayksikkö puuttuu" ],
    lowercase : true,
    maxlength : [ 6, "Korkeintaan 6 merkkiä" ],
    trim : true
  },
  unitCost : {
    type : Number,
    required : [ true, "Yksikkökustannus puuttuu" ],
    min : [ 0, "Ei voi olla negatiivinen luku" ],
    set : parser.round2dp
  },
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
  let count = await this.model("Material")
    .count({ name : this.name })
    .where({ _id : { $ne : this._id } })
  if ( count > 0 )
    this.invalidate(
      "name", "Nimike on jo käytössä", this.name)

  next()
})

schema.options.toJSON = {
  transform : (doc, ret) => {
    ret = parser.trimDbObject(ret)
    ret.unitCost = ret.unitCost.toFixed(2)
    return ret
  }
}

schema.statics.overwrite = (material, data, isAdmin = false) => {
  let keys = [
    "color", "name", "unit", "unitCost"
  ]
  let newValues = parser.filterByKeys(keys, data)
  Object
    .keys(newValues)
    .map(key => material[key] = newValues[key])
}

schema.statics.testAttrs = [
  "color", "name", "unit"
]

schema.statics.updatables = [
  "color", "lastEditedBy", "name", "unit", "unitCost"
]

const Material = mongoose.model("Material", schema)

module.exports = Material
