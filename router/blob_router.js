const Blob = require("../model/blob")
const blobRouter = require("express").Router()
const multer = require("multer")
const { wrapHandler } = require("../util/util")

const upload = multer(
  {
    storage : multer.memoryStorage(),
    limits : { fileSize : ( 4 * 1024 * 1024 ) }  // process.env...?
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
  let blob = await new Blob(
    {
      data : req.file.buffer,
      mime : req.file.mimetype,
      name : req.file.originalname,
      size : req.file.size
    }
  ).save()

  res
    .status(201)
    .json({ id : blob._id })
}))

module.exports = blobRouter
