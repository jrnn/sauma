const jwt = require("jsonwebtoken")

const initEmployees = [
  {
    username : "cnorris",
    pwHash : "$2a$10$AHMSsWzm//1w6Lqqgip9huS4KEbODZOS..ZMu1bfhB5gJsumYz1E2",
    firstName : "Chuck",
    lastName : "McNorrisface",
    email : "chuck@norris.io",
    phone : "69-1337-666",
    enabled : true,
    administrator : true
  },
  {
    username : "spongebob",
    pwHash : "$2a$10$uceoVJPEuKxQw/i5TEo7cOkL8UzEu1ay.Fcte.pQkxGHooJEb8GOK",
    firstName : "Sponge",
    lastName : "McBobface",
    email : "sponge@bob.io",
    phone : "42-313-1337",
    enabled : true,
    administrator : false
  },
  {
    username : "boaty1",
    pwHash : "$2a$10$pntUrZDmf/1ZAoUy4JIP2ukjizWcHK70DujbrAZPoqwpC.XB6UHLK",
    firstName : "Boaty",
    lastName : "McBoatface",
    email : "boaty@boats.io",
    phone : "313-666-1337",
    enabled : false,
    administrator : false
  }
]

const invalidCredentials = [
  { bestDogEver : "Gooby" },
  { password : "trustno1" },
  { password : "Qwerty_123" },
  { username : "jonne" },
  {
    username : "jonne",
    password : "trustno1"
  },
  {
    username : "jonne",
    password : "Qwerty_123"
  },
  { username : "spongebob" },
  {
    username : "spongebob",
    password : "trustno1"
  }
]

const invalidEmployees = [
  { bestDuckEver : "Dolan" },
  {
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "jon",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "spongebob",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "jonne",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "jonne",
    password : "trustno1",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    firstName : "Jonne",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567"
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo",
    phone : "0401234567"
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "C4LL-M3-N0W"
  }
]

const newEmployees = [
  {
    username : "batman",
    password : "Qwerty_123",
    firstName : "Batman",
    lastName : "McRobinface",
    email : "batman@robin.io",
    phone : "040-123 4567"
  },
  {
    username : "beardy",
    password : "Qwerty_123",
    firstName : "Beardy",
    lastName : "McBeardface",
    email : "beardy@goat.ee",
    phone : "04 01 23 45 67"
  },
  {
    username : "heman",
    password : "Qwerty_123",
    firstName : "Heman",
    lastName : "McSkeletorface",
    email : "heman@gmail.com",
    phone : "0401234567"
  }
]

const createToken = (employee, key) =>
  jwt.sign({
    id : employee._id,
    username : employee.username,
    admin : employee.administrator
  }, key)

const newEmployee = () => newEmployees[randomIdx(newEmployees.length)]

const randomIdx = (n) => Math.floor(Math.random() * n)

module.exports = {
  createToken, initEmployees, invalidCredentials, invalidEmployees, newEmployee
}
