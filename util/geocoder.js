const axios = require("axios")
const { env, googleApiKey } = require("./config")

const geocode = async ({ street, zipCode, city }) => {
  const address = encodeURI(`${street}, ${zipCode} ${city}`)
  const uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`

  const res = await axios.get(uri)
  const { results, status } = res.data

  return ( status === "OK" )
    ? results[0].geometry.location
    : null
}

const addCoordinatesToAddress = async (address) => {
  if ( !address || env === "test" ) {
    return address
  }
  const location = await geocode(address)
  return {
    ...address,
    location
  }
}

module.exports = {
  addCoordinatesToAddress,
  geocode
}
