const blobRouter = require("express").Router()
const cloudinary = require("cloudinary")
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
cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET
})

blobRouter.post("/", upload.single("file"), wrapHandler(async (req, res) => {
  let entity = await mongoose
    .model(req.body.entity)
    .findById(req.body.id)

  entity._id  // throws TypeError if !entity

  cloudinary.v2.uploader
    .upload_stream(
      { type : "private" },
      (error, result) => {
        let attachments = entity.attachments.concat(
          {
            name : req.body.name,
            key : result.public_id,
            url : result.secure_url,
            owner : req.auth.id
          }
        )
        res
          .status(201)
          .json({ attachments })
      }
    )
    .end(req.file.buffer)
}))

module.exports = blobRouter
