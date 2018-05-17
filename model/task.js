const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")

const schema = new mongoose.Schema({
  name : {
    type : String,
    required : [ true, "Otsikko puuttuu" ],
    trim : true
  },
  description : {
    type : String,
    required : [ true, "Kuvaus puuttuu" ],
    trim : true
  },
  completed : {
    type : Boolean,
    default : false
  },
  startDate : {
    type : Date,
    required : [ true, "Anna päivämäärä" ]
  },
  endDate : {
    type : Date,
    required : [ true, "Anna päivämäärä" ]
  },
  daysNeeded : {
    type : Number,
    required : [ true, "Työmääräarvio puuttuu" ],
    min : [ 0, "Anna positiivinen kokonaisluku" ],
    set : i => Math.round(i)
  },
  quotas : [{ type : schemas.quota }],
  project : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Project",
    required : [ true, "Työmaa puuttuu" ]
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
  /*  possible additions
   *   - approver (--> Employee)
   *   - interior/exterior
   *   - urakka-/tuntiperustainen
   */
})

schema.pre("validate", async function (next) {
  if ( this.startDate && this.endDate ) {
    if ( this.startDate > this.endDate )
      this.invalidate(
        "endDate", "Loppupvm ei voi edeltää alkupvm:ää", this.endDate)

    let maxDays = Math.ceil((this.endDate - this.startDate + 1) / 86400000)
    if ( this.daysNeeded > maxDays )
      this.invalidate(
        "daysNeeded", "Liikaa päiviä aikatauluarvioon nähden", this.daysNeeded)
  }

  next()
})

schema.options.toJSON = {
  transform : (doc, ret) => {
    ret = parser.trimDbObject(ret)
    ret.daysNeeded = String(ret.daysNeeded)
    return ret
  }
}

schema.statics.overwrite = (task, data, isAdmin = false) => {
  let keys = [
    "attachments", "completed", "daysNeeded", "description",
    "endDate", "quotas", "name", "startDate"
  ]
  let newValues = parser.filterByKeys(keys, data)
  Object
    .keys(newValues)
    .map(key => task[key] = newValues[key])
}

schema.statics.testAttrs = [
  "description", "endDate", "name", "startDate"
]

schema.statics.updatables = [
  "attachments", "completed", "daysNeeded", "description",
  "endDate", "lastEditedBy", "quotas", "name", "startDate"
]

const Task = mongoose.model("Task", schema)

module.exports = Task
