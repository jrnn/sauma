const mongoose = require("mongoose")
const uuid = require("uuid/v4")

const findAllPopulated = async (entity, selector = {}) =>
  await mongoose.model(entity)
    .find(selector)
    .populate("attachments.owner", populateSelector)
    .populate("client", populateSelector)
    .populate("comments.owner", populateSelector)
    .populate("lastEditedBy", populateSelector)
    .populate("manager", populateSelector)
    .populate("owner", populateSelector)
    .populate("project", populateSelector)
    .populate("quotas.material", populateSelector)
    .populate("task", populateSelector)

const findByIdPopulated = async (entity, id) =>
  await mongoose.model(entity)
    .findById(id)
    .populate("attachments.owner", populateSelector)
    .populate("client", populateSelector)
    .populate("comments.owner", populateSelector)
    .populate("lastEditedBy", populateSelector)
    .populate("manager", populateSelector)
    .populate("owner", populateSelector)
    .populate("project", populateSelector)
    .populate("quotas.material", populateSelector)
    .populate("task", populateSelector)

const getUuid = () =>
  uuid().replace(/-/g, "")

const populateSelector = {
  address : 0,
  attachments : 0,
  comments : 0,
  createdOn : 0,
  employees : 0,
  lastEditedBy : 0,
  projects : 0,
  quotas : 0
}

const wrapHandler = (f) =>
  (req, res, next) =>
    f(req, res, next)
      .catch(next)

module.exports = {
  findAllPopulated,
  findByIdPopulated,
  getUuid,
  populateSelector,
  wrapHandler
}
