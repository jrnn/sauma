const uuid = require("uuid/v4")

const getUuid = () =>
  uuid().replace(/-/g, "")

const populateSelector = {
  address : 0,
  attachments : 0,
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
  getUuid,
  populateSelector,
  wrapHandler
}
