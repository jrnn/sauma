const initClients = (userId) => {
  return [
    {
      legalEntity : "ACME Explosives Inc.",
      businessId : "1234567-8",
      contactPerson : "Acme McExplosiveface",
      email : "acme@explosives.inc",
      phone : "42 313 666",
      lastEditedBy : userId
    },
    {
      legalEntity : "Foobar Solutions LLC",
      businessId : "1123581-3",
      contactPerson : "Foo McBarface",
      email : "foo@bar.io",
      phone : "42-3131337",
      lastEditedBy : userId
    },
    {
      legalEntity : "EVVK Yhtiöt Oyj",
      businessId : "2481632-6",
      contactPerson : "Evvk McEvoface",
      email : "info@evvk.fi",
      phone : "0406661337",
      lastEditedBy : userId
    }
  ]
}

const initEmployees = () => {
  return [
    {
      username : "admin_user",
      pwHash : "$2a$10$AHMSsWzm//1w6Lqqgip9huS4KEbODZOS..ZMu1bfhB5gJsumYz1E2",
      firstName : "Admin",
      lastName : "McAdminface",
      email : "admin@sauma.io",
      phone : "42 1337 666",
      enabled : true,
      administrator : true
    },
    {
      username : "basic_user",
      pwHash : "$2a$10$uceoVJPEuKxQw/i5TEo7cOkL8UzEu1ay.Fcte.pQkxGHooJEb8GOK",
      firstName : "Basic",
      lastName : "McBasicface",
      email : "basic@sauma.io",
      phone : "42-31-31-337",
      enabled : true,
      administrator : false
    },
    {
      username : "blocked_user",
      pwHash : "$2a$10$pntUrZDmf/1ZAoUy4JIP2ukjizWcHK70DujbrAZPoqwpC.XB6UHLK",
      firstName : "Blocked",
      lastName : "McBlockface",
      email : "blocked@sauma.io",
      phone : "313 6661337",
      enabled : false,
      administrator : false
    }
  ]
}

const invalidClients = [
  { bestHarkimoEver : "Hjallis" },
  {
    businessId : "0000000-0",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "1234567-8",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "0000000-0",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "0000000-0",
    contactPerson : "Jonne McMopoface",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "0000000-0",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "0000000-0",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "0000000-0",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "C4LL-M3_N0W"
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
  { username : "basic_user" },
  {
    username : "basic_user",
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
    username : "  basic_user",
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

const newClients = [
  {
    legalEntity : "GottaGoFast Inc.",
    businessId : "1392781-2",
    contactPerson : "Sonic McHedgehogface",
    email : "sonic@hedge.hog",
    phone : "13-42 65536 "
  },
  {
    legalEntity : "Tonnin Stiflat Oy",
    businessId : "3357446-8",
    contactPerson : "Tuomari McNurmioface",
    email : "tuomari@nurm.io",
    phone : "096661337"
  },
  {
    legalEntity : "Wayne Enterprises",
    businessId : "1357924-6",
    contactPerson : "Batman McBatmanface",
    email : "batsyn@batm.an",
    phone : "040 1234 567"
  }
]

const newEmployees = [
  {
    username : "boaty",
    password : "Qwerty_123",
    firstName : "Boaty",
    lastName : "McBoatface",
    email : "boaty@sauma.io",
    phone : "040-123 45 67"
  },
  {
    username : "beardy",
    password : "Qwerty_123",
    firstName : "Beardy",
    lastName : "McBeardface",
    email : "beardy@sauma.io",
    phone : "04 01 23 45 67"
  },
  {
    username : "chucky",
    password : "Qwerty_123",
    firstName : "Chuck",
    lastName : "McNorrisface",
    email : "cnorris@sauma.io",
    phone : "0401234567"
  },
  {
    username : "the_dolan",
    password : "Qwerty_123",
    firstName : "Dolan",
    lastName : "McDuckface",
    email : "dolan@sauma.io",
    phone : "0403131337"
  }
]

module.exports = {
  initClients, initEmployees,
  invalidClients, invalidCredentials, invalidEmployees,
  newClients, newEmployees
}
