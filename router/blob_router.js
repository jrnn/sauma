const Blob = require("../model/blob")
const blobRouter = require("express").Router()
const mongoose = require("mongoose")
const multer = require("multer")
const { wrapHandler } = require("../util/util")

const fileSize = Number(process.env.MAX_FILESIZE) || ( 4 * 1024 * 1024 )
const upload = multer(
  {
    storage : multer.memoryStorage(),
    limits : { fileSize }
  }
)

blobRouter.get("/:id", wrapHandler(async (req, res) => {
  let blob = await Blob.findById(req.params.id)

  blob._id  // throws TypeError if !blob
  res
    .header("content-disposition", `inline; filename=${blob.name}`)
    .header("content-type", blob.mime)
    .status(200)
    .send(blob.data)
}))

blobRouter.post("/", upload.single("file"), wrapHandler(async (req, res) => {
  let entity = await mongoose
    .model(req.body.entity)
    .findById(req.body.id)

  entity._id  // throws TypeError if !entity
  let blob = await new Blob(
    {
      data : req.file.buffer,
      mime : req.file.mimetype,
      name : req.file.originalname,
      size : req.file.size
    }
  ).save()

  let attachments = entity.attachments.concat(
    {
      name : req.body.name,
      blob : blob._id,
      owner : req.auth.id
    }
  )

  res
    .status(201)
    .json(attachments)
}))

module.exports = blobRouter
