const getReturnsAllAsJSON = async (api, Entity, path, token) => {
  let data = {}
  let entitiesInDb = await Entity.find()

  let res = await api
    .get(path)
    .set("authorization", `bearer ${token}`)
    .expect(200)
    .expect("content-type", /application\/json/)

  // CAN THIS BE SIMPLIFIED ???
  Entity.testAttrs.map(attr => {
    data = { ...data, [attr] : [] }
    res.body.map(entity =>
      data[attr].push(JSON.stringify(entity[attr])))
  })
  Entity.testAttrs.map(attr =>
    entitiesInDb.map(entity =>
      expect(data[attr]).toContain(JSON.stringify(entity[attr]))))

  expect(res.body.length).toBe(entitiesInDb.length)
}

const getReturnsOneAsJSON = async (api, Entity, entity, path, token) => {
  let res = await api
    .get(path)
    .set("authorization", `bearer ${token}`)
    .expect(200)
    .expect("content-type", /application\/json/)

  Entity.testAttrs.map(attr =>
    expect(JSON.stringify(res.body[attr]))
      .toEqual(JSON.stringify(entity[attr])))
}

const getFailsWithStatusCode = async (api, path, statusCode, token) => {
  await api
    .get(path)
    .set("authorization", `bearer ${token}`)
    .expect(statusCode)
}

const postReturnsNewAsJson = async (api, Entity, entity, path, token) => {
  let entitiesBefore = await Entity.find()

  let res = await api
    .post(path)
    .set("authorization", `bearer ${token}`)
    .send(entity)
    .expect(201)
    .expect("content-type", /application\/json/)

  let entitiesAfter = await Entity.find()
  expect(entitiesAfter.length).toBe(entitiesBefore.length + 1)

  entity = new Entity(entity)
  Entity.testAttrs.map(attr =>
    expect(JSON.stringify(res.body[attr]))
      .toEqual(JSON.stringify(entity[attr])))
}

const postDoesNotAffectExisting = async (api, Entity, entity, path, token) => {
  let entitiesBefore = await Entity.find().sort("_id")

  let res = await api
    .post(path)
    .set("authorization", `bearer ${token}`)
    .send(entity)

  let entitiesAfter = await Entity
    .find()
    .where({ _id : { $ne : res.body.id } })
    .sort("_id")

  expect(JSON.stringify(entitiesBefore))
    .toEqual(JSON.stringify(entitiesAfter))
}

const postFailsWithStatusCode = async (api, Entity, entities, path, statusCode, token) => {
  let entitiesBefore = await Entity.find()

  await Promise
    .all(entities
      .map(entity => api
        .post(path)
        .set("authorization", `bearer ${token}`)
        .send(entity)
        .expect(statusCode)
      ))

  let entitiesAfter = await Entity.find()
  expect(entitiesAfter.length).toBe(entitiesBefore.length)
}

const putReturnsUpdatedAsJson = async (api, Entity, original, updates, path, token) => {
  await api
    .put(path)
    .set("authorization", `bearer ${token}`)
    .send(updates)
    .expect(200)
    .expect("content-type", /application\/json/)

  updates = new Entity(updates)
  let updated = await Entity.findById(original.id)

  Object.keys(updates._doc).map(key => {
    let u = JSON.stringify(updated[key])
    if (Entity.updatables.includes(key))
      expect(u).toEqual(JSON.stringify(updates[key]))
    else
      expect(u).toEqual(JSON.stringify(original[key]))
  })
}

const putOnlyAffectsOne = async (api, Entity, original, updates, path, token) => {
  let entitiesBefore = await Entity
    .find()
    .where({ _id : { $ne : original.id } })
    .sort("_id")

  await api
    .put(path)
    .set("authorization", `bearer ${token}`)
    .send(updates)
    .expect(200)

  let entitiesAfter = await Entity
    .find()
    .where({ _id : { $ne : original.id } })
    .sort("_id")

  expect(JSON.stringify(entitiesBefore))
    .toEqual(JSON.stringify(entitiesAfter))
}

const putFailsWithStatusCode = async (api, Entity, updates, path, statusCode, token) => {
  let entitiesBefore = await Entity.find()

  await Promise
    .all(updates
      .map(update => api
        .put(path)
        .set("authorization", `bearer ${token}`)
        .send(update)
        .expect(statusCode)
      ))

  let entitiesAfter = await Entity.find()
  expect(entitiesAfter.length).toBe(entitiesBefore.length)
}

module.exports = {
  getReturnsAllAsJSON,
  getReturnsOneAsJSON,
  getFailsWithStatusCode,
  postReturnsNewAsJson,
  postDoesNotAffectExisting,
  postFailsWithStatusCode,
  putReturnsUpdatedAsJson,
  putOnlyAffectsOne,
  putFailsWithStatusCode
}
