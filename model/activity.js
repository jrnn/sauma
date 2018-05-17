const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")

const schema = new mongoose.Schema({
  description : {
    type : String,
    required : [ true, "Kuvaus puuttuu" ],
    trim : true
  },
  date : {
    type : Date,
    required : [ true, "Anna päivämäärä" ],
    max : [ Date.now, "Ei voi olla tulevaisuudessa" ]
  },
  hours : {
    type : Number,
    required : [ true, "Työtunnit puuttuu" ],
    min : [ 0, "Anna positiivinen kokonaisluku" ],
    set : i => Math.round(i)
  },
  contractScope : {
    type : Boolean,
    default : true
  },
  signed : {
    type : Boolean,
    default : false
  },
  quotas : [{ type : schemas.quota }],
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : [ true, "Tekijä puuttuu" ]
  },
  task : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Task",
    required : [ true, "Tehtävä puuttuu" ]
  },
  project : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Project"
  },
  attachments : [{ type : schemas.attachment }],
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

schema.options.toJSON = {
  transform : (doc, ret) => {
    ret = parser.trimDbObject(ret)
    ret.hours = String(ret.hours)
    return ret
  }
}

schema.statics.overwrite = (activity, data, isAdmin = false) => {
  let keys = [
    "attachments", "contractScope", "date",
    "description", "hours", "quotas"
  ]
  let newValues = parser.filterByKeys(keys, data)
  Object
    .keys(newValues)
    .map(key => activity[key] = newValues[key])
}

schema.statics.testAttrs = [ "date", "description", "hours" ]

schema.statics.updatables = [
  "attachments", "contractScope", "date",
  "description", "hours", "quotas", "signed"
]

const Activity = mongoose.model("Activity", schema)

module.exports = Activity
