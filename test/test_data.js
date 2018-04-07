const initClients = [
  {
    legalEntity : "ACME Explosives Inc.",
    businessId : "1234567-8",
    contactPerson : "Acme McExplosiveface",
    email : "acme@explosives.inc",
    phone : "42 313 666"
  },
  {
    legalEntity : "Foobar Solutions LLC",
    businessId : "1123581-3",
    contactPerson : "Foo McBarface",
    email : "foo@bar.io",
    phone : "42-3131337"
  },
  {
    legalEntity : "EVVK Yhtiöt Oyj",
    businessId : "2481632-6",
    contactPerson : "Evvk McEvoface",
    email : "info@evvk.fi",
    phone : "0406661337"
  }
]

const initEmployees = [
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
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    }
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "0000000-0",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "C4LL-M3_N0W"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "0000000-0",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567",
    address : {
      streetExt : "Mopo avenue 13 ES",
      city : "Kerava",
      country : "Finland"
    }
  }
]

const invalidClientUpdates = [
  {
    legalEntity : "    ",
    businessId : "9999999-9",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "    ",
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
    businessId : "9999999-9",
    contactPerson : "    ",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "9999999-9",
    contactPerson : "Jonne McMopoface",
    email : "    ",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "9999999-9",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo",
    phone : "0401234567"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "9999999-9",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "    "
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "9999999-9",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "040123456789"
  },
  {
    legalEntity : "Jonnen Mopopaja Oy",
    businessId : "9999999-9",
    contactPerson : "Jonne McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567",
    address :{
      streetExt : "not_a_valid_address",
      zipCode : "not_a_valid_zipcode"
    }
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
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    }
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "C4LL-M3-N0W"
  },
  {
    username : "jonne",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567",
    address : {
      streetExt : "Mopo avenue 13 ES",
      city : "Kerava",
      country : "Finland"
    }
  }
]

const invalidEmployeeUpdates = [
  {
    administrator : "   ",
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : "not_boolean",
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    address : {
      streetExt : "not_a_valid_address",
      zipCode : "not_a_valid_zipcode"
    },
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    email : "    ",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : "    ",
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : 12345,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "    ",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "    ",
    phone : "0401234567",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "    ",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "040123456789",
    username : "jonne"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "    "
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "jon"
  },
  {
    administrator : true,
    email : "jonne@mopo.es",
    enabled : false,
    firstName : "Jonne",
    lastName : "McMopoface",
    phone : "0401234567",
    username : "basic_user"
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
    legalEntity : "Quadruple Roundhouse Kicks LLC",
    businessId : "5179382-0",
    contactPerson : "Chuck McNorrisface",
    email : "cnorris@sauma.io",
    phone : "134265526"
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
    email : "batsy@batm.an",
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
  },
  {
    username : "tylerdurden",
    password : "Qwerty_123",
    firstName : "Tyler",
    lastName : "McDurdenface",
    email : "t_durd@sauma.io",
    phone : "0 4 0 4 2 6 5 5 3 6"
  }
]

const updateClients = [
  {
    legalEntity : "Altered Explosives Inc.",
    businessId : "0000000-0",
    contactPerson : "Altered McAlterface",
    email : "altered_email@sauma.io",
    phone : "048048048",
    address : {
      street : "480 Altered Avenue",
      zipCode : "40404",
      city : "Altertown",
      country : "Alterstan"
    },
    createdOn : new Date(1986,3,7),
    lastEditedBy : "this_shall_not_pass"
  },
  {
    legalEntity : "Changed Explosives Inc.",
    businessId : "1111111-1",
    contactPerson : "Changed McChangeface",
    email : "changed_email@sauma.io",
    phone : "0000000000",
    address : {
      street : "313 Changed Street",
      zipCode : "00000",
      city : "Changedtown",
      country : "Changedstan"
    },
    createdOn : new Date(1999,1,1),
    lastEditedBy : "this_shall_not_pass"
  },
  {
    legalEntity : "Different Explosives Inc.",
    businessId : "2222222-2",
    contactPerson : "Different McDifferentface",
    email : "different_email@sauma.io",
    phone : "8888-8888",
    address : {
      street : "313 Different Avenue",
      zipCode : "30303",
      city : "Differenttown",
      country : "Differentland"
    },
    createdOn : new Date(2003,3,3),
    lastEditedBy : "this_shall_not_pass"
  },
  {
    legalEntity : "Not the Same Explosives Inc.",
    businessId : "3333333-3",
    contactPerson : "Notthe McSameface",
    email : "not_the_same@sauma.io",
    phone : "999-999-999",
    address : {
      street : "99 Not the Same Street",
      zipCode : "90909",
      city : "Not the same town",
      country : "Not the Same States of America"
    },
    createdOn : new Date(1993,9,9),
    lastEditedBy : "this_shall_not_pass"
  },
  {
    legalEntity : "Updated Explosives Inc.",
    businessId : "4444444-4",
    contactPerson : "Updated McUpdateface",
    email : "updated_email@sauma.io",
    phone : "4 44 444 4444",
    address : {
      street : "444 Updated Street",
      zipCode : "44444",
      city : "Updateville",
      country : "Updated States of America"
    },
    createdOn : new Date(2006,6,6),
    lastEditedBy : "this_shall_not_pass"
  }
]

const updateEmployees = [
  {
    username : "altered_username",
    pwHash : "$2a$10$xr.lo..fz4nP5WewEMMI3OKIZ.51x2DXdr0Rf9wByi3H3MPC5CBK.",
    firstName : "Altered firstName",
    lastName : "Altered lastName",
    email : "altered_email@sauma.io",
    phone : "048048048",
    address : {
      street : "480 Altered Avenue",
      zipCode : "40404",
      city : "Altertown",
      country : "Alterstan"
    },
    createdOn : new Date(1986,3,7)
  },
  {
    username : "changed_username",
    pwHash : "$2a$10$xr.lo..fz4nP5WewEMMI3OKIZ.51x2DXdr0Rf9wByi3H3MPC5CBK.",
    firstName : "Changed firstName",
    lastName : "Changed lastName",
    email : "changed_email@sauma.io",
    phone : "0000000000",
    address : {
      street : "313 Changed Street",
      zipCode : "00000",
      city : "Changedtown",
      country : "Changedstan"
    },
    createdOn : new Date(1999,1,1)
  },
  {
    username : "different_username",
    pwHash : "$2a$10$xr.lo..fz4nP5WewEMMI3OKIZ.51x2DXdr0Rf9wByi3H3MPC5CBK.",
    firstName : "Different firstName",
    lastName : "Different lastName",
    email : "different_email@sauma.io",
    phone : "8888-8888",
    address : {
      street : "313 Different Avenue",
      zipCode : "30303",
      city : "Differenttown",
      country : "Differentland"
    },
    createdOn : new Date(2003,3,3)
  },
  {
    username : "not_the_same_username",
    pwHash : "$2a$10$xr.lo..fz4nP5WewEMMI3OKIZ.51x2DXdr0Rf9wByi3H3MPC5CBK.",
    firstName : "Not the same firstName",
    lastName : "Not the same lastName",
    email : "not_the_same@sauma.io",
    phone : "999-999-999",
    address : {
      street : "99 Not the Same Street",
      zipCode : "90909",
      city : "Not the same town",
      country : "Not the Same States of America"
    },
    createdOn : new Date(1993,9,9)
  },
  {
    username : "updated_username",
    pwHash : "$2a$10$xr.lo..fz4nP5WewEMMI3OKIZ.51x2DXdr0Rf9wByi3H3MPC5CBK.",
    firstName : "Updated firstName",
    lastName : "Updated lastName",
    email : "updated_email@sauma.io",
    phone : "4 44 444 4444",
    address : {
      street : "444 Updated Street",
      zipCode : "44444",
      city : "Updateville",
      country : "Updated States of America"
    },
    createdOn : new Date(2006,6,6)
  }
]

const validAddresses = [
  {
    name : "Dolan Duck",
    street : "1313 Webfoot Walk",
    zipCode : "112358",
    city : "Duckburg",
    country : "Disneyland"
  },
  {
    name : "Fred Flintstone",
    street : "301 Cobblestone Way",
    zipCode : "70777",
    city : "Bedrock",
    country : "Stone Age"
  },
  {
    name : "Homer Simpson",
    street : "740 Evergreen Terrace",
    zipCode : "112358",
    city : "Springfield",
    country : "United States of America"
  },
  {
    name : "Mr. Bean",
    street : "2-12 Arbour Road",
    streetExt : "Highbury",
    zipCode : "112358",
    city : "London",
    country : "United Kingdom"
  },
  {
    name : "Peter Griffin",
    street : "31 Spooner Street",
    zipCode : "112358",
    city : "Quahog",
    country : "United States of America"
  },
  {
    name : "Sherlock Holmes",
    street : "221B Baker Street",
    zipCode : "112358",
    city : "London",
    country : "United Kingdom"
  },
  {
    name : "Spongebob Squarepants",
    street : "124 Conch Street",
    zipCode : "112358",
    city : "Bikini Bottom",
    country : "Pacific Ocean"
  },
  {
    name : "Tyler Durden",
    street : "420 Paper Street",
    zipCode : "19886",
    city : "Wilmington",
    country : "United States of America"
  }
]

module.exports = {
  initClients,
  initEmployees,
  invalidClients,
  invalidClientUpdates,
  invalidCredentials,
  invalidEmployees,
  invalidEmployeeUpdates,
  newClients,
  newEmployees,
  updateClients,
  updateEmployees,
  validAddresses
}
