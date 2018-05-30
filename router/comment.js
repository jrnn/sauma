const commentRouter = require("express").Router()
const mongoose = require("mongoose")
const { wrapHandler } = require("./helper")

commentRouter.post("/", wrapHandler(async (req, res) => {
  let Entity = mongoose.model(req.body.entity)
  let entity = await Entity.findById(req.body.id)

  entity._id  // throws TypeError if !entity
  let comments = entity.comments.concat(
    {
      owner : req.auth.id,
      text : req.body.text
    }
  )

  await Entity.findByIdAndUpdate(req.body.id, { comments })
  res
    .status(201)
    .end()
}))

module.exports = commentRouter
