const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")

const schema = new mongoose.Schema({
  projectId : {
    type : String,
    required : [ true, "Työnumero puuttuu" ],
    trim : true
  },
  startDate : {
    type : Date,
    required : [ true, "Anna päivämäärä" ]
  },
  endDate : { type : Date },
  address : {
    type : schemas.address,
    required : [ true, "Osoite puuttuu" ]
  },
  createdOn : {
    type : Date,
    default : Date.now
  },
  client : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client",
    required : [ true, "Asiakas puuttuu" ]
  },
  manager : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : [ true, "Työnjohtaja puuttuu" ]
  },
  employees : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Employee"
    }
  ],
  lastEditedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Employee",
    required : true
  }
  /*  possible additions
   *   - description
   */
})

schema.options.toJSON = {
  transform : (doc, ret) => parser.trimDbObject(ret)
}

schema.pre("validate", async function (next) {
  if ( this.endDate && this.startDate > this.endDate )
    this.invalidate(
      "endDate", "Loppupvm ei voi edeltää alkupvm:ää", this.endDate)

  let count = await this.model("Project")
    .count({ projectId : this.projectId })
    .where({ _id : { $ne : this._id } })
  if ( count > 0 )
    this.invalidate(
      "projectId", "Työnumero on jo käytössä", this.projectId)

  if ( this.manager ) {
    let manager = await this.model("Employee")
      .findById(this.manager)
    if ( !manager || !manager.administrator )
      this.invalidate(
        "manager", "Ei työnjohtajan valtuuksia", this.manager)
  }

  next()
})

schema.statics.overwrite = (project, data, isAdmin = false) => {
  let newValues = parser.filterByKeys([
    "address", "endDate", "manager", "projectId", "startDate"
  ], data)
  Object
    .keys(newValues)
    .map(key => project[key] = newValues[key])
}

schema.statics.testAttrs = [
  "address", "endDate", "projectId", "startDate"
]

schema.statics.updatables = [
  "address", "endDate", "lastEditedBy", "manager", "projectId", "startDate"
]

const Project = mongoose.model("Project", schema)

module.exports = Project
