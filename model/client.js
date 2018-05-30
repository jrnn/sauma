const mongoose = require("mongoose")
const parser = require("../util/parser")
const schemas = require("./shared_schemas")

const schema = new mongoose.Schema({
  businessId : {
    type : String,
    required : [ true, "Y-tunnus puuttuu" ],
    trim : true
  },
  legalEntity : {
    type : String,
    required : [ true, "Toiminimi puuttuu" ],
    trim : true
  },
  domicile : {
    type : String,
    required : [ true, "Kotipaikka puuttuu" ],
    trim : true
  },
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

schema.pre("validate", async function (next) {
  let count = await this.model("Client")
    .count({ businessId : this.businessId })
    .where({ _id : { $ne : this._id } })
  if ( count > 0 )
    this.invalidate(
      "businessId", "Y-tunnus on jo käytössä", this.businessId)

  next()
})

schema.options.toJSON = {
  transform : (doc, ret) => parser.trimDbObject(ret)
}

schema.statics.overwrite = (client, data) => {
  let newValues = parser.filterByKeys([
    "attachments", "businessId", "domicile", "legalEntity"
  ], data)
  Object
    .keys(newValues)
    .map(key => client[key] = newValues[key])
}

schema.statics.testAttrs = [ "businessId", "domicile", "legalEntity" ]

schema.statics.updatables = [
  "attachments", "businessId", "domicile", "lastEditedBy", "legalEntity"
]

const Client = mongoose.model("Client", schema)

module.exports = Client
