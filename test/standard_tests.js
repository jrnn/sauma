const getReturnsAllAsJSON = async (api, Entity, path, token) => {
  let data = {}
  let entitiesInDb = await Entity.find()

  let res = await api
    .get(path)
    .set("authorization", `bearer ${token}`)
    .expect(200)
    .expect("content-type", /application\/json/)

  Entity.testAttrs.map(attr => {
    data = { ...data, [attr] : [] }
    res.body.map(entity => data[attr].push(entity[attr]))
  })
  Entity.testAttrs.map(attr => {
    entitiesInDb.map(entity =>
      expect(data[attr]).toContain(entity[attr]))
  })
  expect(res.body.length).toBe(entitiesInDb.length)
}

const getReturnsOneAsJSON = async (api, Entity, entity, path, token) => {
  let res = await api
    .get(`${path}/${entity.id}`)
    .set("authorization", `bearer ${token}`)
    .expect(200)
    .expect("content-type", /application\/json/)

  Entity.testAttrs.map(attr =>
    expect(res.body[attr]).toEqual(entity[attr]))
}

const getReturnsStatusCode = async (api, path, statusCode, token) => {
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
    expect(res.body[attr]).toEqual(entity[attr]))
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

module.exports = {
  getReturnsAllAsJSON, getReturnsOneAsJSON, getReturnsStatusCode,
  postReturnsNewAsJson, postFailsWithStatusCode
}
