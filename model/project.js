const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")
const validator = require("../util/validator")

const schema = new mongoose.Schema({
  projectId : {
    type : String,
    required : [ true, "Työnumero puuttuu" ],
    trim : true
  },
  name : {
    type : String,
    required : [ true, "Työmaan nimi puuttuu" ],
    trim : true
  },
  startDate : {
    type : Date,
    required : [ true, "Anna päivämäärä" ]
  },
  endDate : { type : Date },
  contactPerson : {
    type : String,
    required : [ true, "Yhteyshenkilö puuttuu" ],
    trim : true
  },
  phone : {
    type : String,
    required : [ true, "Puhelin puuttuu" ],
    set : parser.formatPhone,
    validate : {
      validator : validator.validatePhone,
      message : "Virheellinen numero"
    }
  },
  address : {
    type : schemas.addressWithCoordinates,
    required : [ true, "Osoite puuttuu" ]
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
  attachments : [{ type : schemas.attachment }],
  comments : [{ type : schemas.comment }],
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
  transform : (doc, ret) => parser.trimDbObject(ret)
}

schema.pre("validate", async function (next) {
  if ( this.endDate && this.startDate > this.endDate )
    this.invalidate(
      "endDate", "Loppupvm ei voi edeltää alkupvm:ää", this.endDate)

  let count = await this.model("Project")
    .countDocuments({ projectId : this.projectId })
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

schema.statics.overwrite = (project, data) => {
  let newValues = parser.filterByKeys([
    "address", "attachments", "contactPerson", "endDate",
    "manager", "name", "phone", "projectId", "startDate"
  ], data)
  Object
    .keys(newValues)
    .map(key => project[key] = newValues[key])
}

schema.statics.testAttrs = [
  "address", "contactPerson", "endDate",
  "name", "phone", "projectId", "startDate"
]

schema.statics.updatables = [
  "address", "attachments", "contactPerson", "endDate", "lastEditedBy",
  "manager", "name", "phone", "projectId", "startDate"
]

const Project = mongoose.model("Project", schema)

module.exports = Project
