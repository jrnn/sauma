const { app } = require("../index")
const { env, mongoOpts } = require("../util/config")
const { MongoMemoryServer } = require("mongodb-memory-server")
const mongoose = require("mongoose")
const supertest = require("supertest")

if ( env !== "test" ) {
  console.error("tests must be run in test mode!")
  process.exit(1)
}

const api = supertest(app)
const db = new MongoMemoryServer()

jest.setTimeout(60000)

beforeAll(() => {
  return new Promise((resolve, reject) => {
    db
      .getConnectionString()
      .then(uri => {
        mongoose
          .connect(uri, mongoOpts)
          .then(() => {
            console.log(`Now connected to in-memory database at ${uri}`)
            resolve()
          })
          .catch(error => {
            console.error(error)
            reject()
          })
      })
  })
})

afterAll(() => {
  return new Promise((resolve, reject) => {
    mongoose
      .disconnect()
      .then(() => {
        db.stop()
        console.log("In-memory database teardown complete")
        resolve()
      })
      .catch(error => {
        console.error(error)
        reject()
      })
  })
})

module.exports = { api }
