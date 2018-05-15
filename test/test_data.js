const initClients = [
  {
    legalEntity : "First Client Inc.",
    businessId : "client1",
    contactPerson : "Client McOneface",
    email : "client1@sauma.io",
    phone : "42 313 666"
  },
  {
    legalEntity : "Second Client Inc.",
    businessId : "client2",
    contactPerson : "Client McTwoface",
    email : "client2@sauma.io",
    phone : "42-3131337"
  },
  {
    legalEntity : "Third Client Inc.",
    businessId : "client3",
    contactPerson : "Client McThreeface",
    email : "client3@sauma.io",
    phone : "0406661337"
  }
]

const initEmployees = [
  {
    username : "admin1",
    firstName : "Admin",
    lastName : "McOneface",
    email : "admin1@sauma.io",
    phone : "42 1337 666",
    enabled : true,
    administrator : true
  },
  {
    username : "admin2",
    firstName : "Admin",
    lastName : "McTwoface",
    email : "admin2@sauma.io",
    phone : "1 42 313 666",
    enabled : true,
    administrator : true
  },
  {
    username : "admin3",
    firstName : "Admin",
    lastName : "McThreeface",
    email : "admin3@sauma.io",
    phone : "42-31-31-313",
    enabled : true,
    administrator : true
  },
  {
    username : "basic1",
    firstName : "Basic",
    lastName : "McOneface",
    email : "basic1@sauma.io",
    phone : "03 798 1337",
    enabled : true,
    administrator : false
  },
  {
    username : "basic2",
    firstName : "Basic",
    lastName : "McTwoface",
    email : "basic2@sauma.io",
    phone : "1 12 358 1321",
    enabled : true,
    administrator : false
  },
  {
    username : "basic3",
    firstName : "Basic",
    lastName : "McThreeface",
    email : "basic3@sauma.io",
    phone : "040-12-34-567",
    enabled : true,
    administrator : false
  },
  {
    username : "blocked1",
    firstName : "Blocked",
    lastName : "McOneface",
    email : "blocked1@sauma.io",
    phone : "3136661337",
    enabled : false,
    administrator : false
  }
]

const initMaterials = [
  {
    name : "Bananas",
    unit : "kg",
    unitCost : 1.99
  },
  {
    name : "Coconuts",
    unit : "kg",
    unitCost : 3.95
  },
  {
    name : "Garden Gnomes",
    unit : "pcs",
    unitCost : 34.50
  },
  {
    name : "Parquet",
    unit : "sqm",
    unitCost : 69.95
  },
  {
    name : "Toilet paper",
    unit : "roll",
    unitCost : 0.88
  }
]

const initProjects = [
  {
    projectId : "first_project",
    startDate : new Date(2014, 4, 4),
    endDate : new Date(2015, 5, 5)
  },
  {
    projectId : "second_project",
    startDate : new Date(2015, 5, 5),
    endDate : new Date(2016, 6, 6)
  },
  {
    projectId : "third_project",
    startDate : new Date(2016, 6, 6),
    endDate : new Date(2017, 7, 7)
  }
]

const initTasks = [
  {
    name : "Get stuff done",
    description : "Get stuff done",
    startDate : new Date(2018, 1, 1),
    endDate : new Date(2018, 1, 10),
    daysNeeded : 5
  },
  {
    name : "Take care of business",
    description : "Take care of business",
    startDate : new Date(2017, 3, 7),
    endDate : new Date(2017, 3, 17),
    daysNeeded : 10
  },
  {
    name : "Do this one really important thing",
    description : "Do this one really important thing",
    startDate : new Date(2017, 7, 13),
    endDate : new Date(2017, 8, 21),
    daysNeeded : 30
  },
  {
    name : "Handle another important errand",
    description : "Handle another important errand",
    startDate : new Date(2017, 5, 1),
    endDate : new Date(2017, 5, 31),
    daysNeeded : 15
  },
  {
    name : "Make that one thing happen",
    description : "Make that one thing happen",
    startDate : new Date(2017, 9, 9),
    endDate : new Date(2017, 10, 10),
    daysNeeded : 25
  },
  {
    name : "Wrap up loose ends",
    description : "Wrap up loose ends",
    startDate : new Date(2017, 11, 11),
    endDate : new Date(2017, 12, 12),
    daysNeeded : 20
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
    businessId : "client1",
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
    businessId : "client1",
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
  { username : "basic1" },
  {
    username : "basic1",
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
    username : "  basic1 ",
    password : "Qwerty_123",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  /*{
    username : "jonne",       TEMPORARILY OUT
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },
  {
    username : "jonne",       TEMPORARILY OUT
    password : "trustno1",
    firstName : "Jonne",
    lastName : "McMopoface",
    email : "jonne@mopo.es",
    phone : "0401234567"
  },*/
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
    username : "  basic1"
  }
]

const invalidMaterials = [
  { bestMaterialsEver : "All New Materials" },
  {
    unit : "pcs",
    unitCost : 1337
  },
  {
    name : "Bananas",
    unit : "pcs",
    unitCost : 1337
  },
  {
    name : "Jonnen mopo",
    unitCost : 1337
  },
  {
    name : "Jonnen mopo",
    unit : "not_short_enough",
    unitCost : 1337
  },
  {
    name : "Jonnen mopo",
    unit : "pcs",
    unitCost : -0.01
  },
  {
    name : "Jonnen mopo",
    unit : "pcs",
    unitCost : "kuha_on_varaani"
  }
]

const invalidMaterialUpdates = [
  { name : "Bananas" },
  { unit : "not_short_enough" },
  { unitCost : -0.01 },
  { unitCost : "kuha_on_varaani" }
]

const invalidProjects = (managerId, clientId) => [
  { bestNameForCatEver : "Ari" },
  {
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId,
    manager : managerId
  },
  {
    projectId : "first_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId,
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId,
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : "this is not a valid date",
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId,
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : "this is not a valid date",
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId,
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2017, 7, 7),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId,
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    client : clientId,
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    address : {
      streetExt : "Mopo avenue 13 ES",
      city : "Kerava"
    },
    client : clientId,
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : "this_is_not_a_valid_id",
    manager : managerId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId
  },
  {
    projectId : "jonnen_mopo_project",
    startDate : new Date(2018, 8, 8),
    endDate : new Date(2019, 9, 9),
    address : {
      street : "Mopo avenue 13 ES",
      zipCode : "13579",
      city : "Kerava",
      country : "Finland"
    },
    client : clientId,
    manager : "this_is_not_a_valid_id"
  }
]

const invalidProjectUpdates = [
  { projectId : "first_project" },
  { startDate : "this_is_not_a_valid_date" },
  { endDate : "this_is_not_a_valid_date" },
  {
    startDate : new Date(2019, 9, 9),
    endDate : new Date(2017, 7, 7)
  },
  {
    address : {
      streetExt : "Mopo avenue 13 ES",
      city : "Kerava"
    }
  },
  { manager : "this_is_not_a_valid_id" }
]

const invalidTasks = (projectId, materialId) => [
  { bestPaperEver : "Kofii peippör" },
  {
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : "this_is_not_a_valid_date",
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(1999, 9, 9),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : "this_is_not_a_valid_date",
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : "kuha_on_varaani",
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : -1,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 1337,
    project : projectId,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : "this_is_not_a_valid_id",
    quotas : [{ material : materialId, quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : "this_is_not_a_valid_id", quantity : 42 }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : "kuha_on_varaani" }]
  },
  {
    name : "Jonnen mopotask",
    description : "Buy ES and mopo for Jonne",
    startDate : new Date(2017, 7, 7),
    endDate : new Date(2018, 8, 8),
    daysNeeded : 42,
    project : projectId,
    quotas : [{ material : materialId, quantity : -1 }]
  }
]

const invalidTaskUpdates = (materialId) => [
  { startDate : "this_is_not_a_valid_date" },
  { endDate : "this_is_not_a_valid_date" },
  {
    startDate : new Date(2019, 9, 9),
    endDate : new Date(2017, 7, 7)
  },
  { daysNeeded : "kuha_on_varaani" },
  { daysNeeded : -13 },
  { daysNeeded : 65536 },
  { quotas : [{ quantity : 1337 }] },
  { quotas : [{ material : "this_is_not_a_valid_id", quantity : 1337 }] },
  { quotas : [{ material : materialId }] },
  { quotas : [{ material : materialId, quantity : "kuha_on_varaani" }] },
  { quotas : [{ material : materialId, quantity : -1 }] }
]

const newClients = [
  {
    legalEntity : "First New Client Inc.",
    businessId : "new_client1",
    contactPerson : "First McNewface",
    email : "new1@client.io",
    phone : "13-42 65536 "
  },
  {
    legalEntity : "Second New Client Inc.",
    businessId : "new_client2",
    contactPerson : "Second McNewface",
    email : "new2@client.io",
    phone : "134265526"
  },
  {
    legalEntity : "Third New Client Inc.",
    businessId : "new_client3",
    contactPerson : "Third McNewface",
    email : "new3@client.io",
    phone : "096661337"
  },
  {
    legalEntity : "Fourth New Client Inc.",
    businessId : "new_client4",
    contactPerson : "Fourth McNewface",
    email : "new4@client.io",
    phone : "040 1234 567"
  },
  {
    legalEntity : "Fifth New Client Inc.",
    businessId : "new_client5",
    contactPerson : "Fifth McNewface",
    email : "new5@client.io",
    phone : "112-358-132"
  },
  {
    legalEntity : "Sixth New Client Inc.",
    businessId : "new_client6",
    contactPerson : "Sixth McNewface",
    email : "new6@client.io",
    phone : "    4266 6 1337"
  },
  {
    legalEntity : "Se7enth New Client Inc.",
    businessId : "new_client7",
    contactPerson : "Seventh McNewface",
    email : "new7@client.io",
    phone : "1-3141   3141"
  }
]

const newEmployees = [
  {
    username : "ari_jarno",
    password : "Qwerty_123",
    firstName : "Ari",
    lastName : "McJarnoface",
    email : "ari@sauma.io",
    phone : "09-798 1337"
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
    username : "boaty",
    password : "Qwerty_123",
    firstName : "Boaty",
    lastName : "McBoatface",
    email : "boaty@sauma.io",
    phone : "040-123 45 67"
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
    username : "dolan",
    password : "Qwerty_123",
    firstName : "Dolan",
    lastName : "McDuckface",
    email : "dolan@sauma.io",
    phone : "0403131337"
  },
  {
    username : "nuusq_",
    password : "Qwerty_123",
    firstName : "Nuuska",
    lastName : "McMuikQnenface",
    email : "nuuskq@sauma.io",
    phone : "045 666 42 42"
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

const newMaterials = [
  {
    name : "Bricks",
    unit : "cube",
    unitCost : 55.55
  },
  {
    name : "Bourbon",
    unit : "liter",
    unitCost : 49.50
  },
  {
    name : "Catnip",
    unit : "kg",
    unitCost : 3.33
  },
  {
    name : "Chess boards",
    unit : "pcs",
    unitCost : 19.95
  },
  {
    name : "Coffee beans",
    unit : "kg",
    unitCost : 5.99
  },
  {
    name : "Potatoes",
    unit : "kg",
    unitCost : 0.79
  },
  {
    name : "Yoghurt",
    unit : "liter",
    unitCost : 2.49
  }
]

const newProjects = [
  {
    projectId : "two_a_penny_project",
    startDate : new Date(2009, 9, 9),
    endDate : new Date(2011, 11, 11)
  },
  {
    projectId : "yet_another_project",
    startDate : new Date(2010, 10, 10),
    endDate : new Date(2012, 2, 2)
  },
  {
    projectId : "one_more_project",
    startDate : new Date(2011, 11, 11),
    endDate : new Date(2013, 3, 3)
  },
  {
    projectId : "not_the_last_project",
    startDate : new Date(2012, 2, 2),
    endDate : new Date(2014, 4, 4)
  },
  {
    projectId : "however_manyeth_project",
    startDate : new Date(2013, 3, 3),
    endDate : new Date(2015, 5, 5)
  },
  {
    projectId : "dime_a_dozen_project",
    startDate : new Date(2014, 4, 4),
    endDate : new Date(2016, 6, 6)
  },
  {
    projectId : "run_of_the_mill_project",
    startDate : new Date(2015, 5, 5),
    endDate : new Date(2017, 7, 7)
  }
]

const newTasks = [
  {
    name : "Get all ducks in a row",
    description : "Get all ducks in a row",
    startDate : new Date(2018, 1, 1),
    endDate : new Date(2018, 1, 10),
    daysNeeded : 1
  },
  {
    name : "Explore further avenues",
    description : "Explore further avenues",
    startDate : new Date(2018, 2, 2),
    endDate : new Date(2018, 2, 12),
    daysNeeded : 2
  },
  {
    name : "Get more stuff off the plate",
    description : "Get more stuff off the plate",
    startDate : new Date(2018, 3, 3),
    endDate : new Date(2018, 3, 13),
    daysNeeded : 3
  },
  {
    name : "See some stuff through",
    description : "See some stuff through",
    startDate : new Date(2018, 4, 4),
    endDate : new Date(2018, 4, 14),
    daysNeeded : 4
  },
  {
    name : "Conduct important transactions",
    description : "Conduct important transactions",
    startDate : new Date(2018, 5, 5),
    endDate : new Date(2018, 5, 15),
    daysNeeded : 5
  },
  {
    name : "Engage in productive activity",
    description : "Engage in productive activity",
    startDate : new Date(2018, 6, 6),
    endDate : new Date(2018, 6, 16),
    daysNeeded : 6
  },
  {
    name : "Run for the hills",
    description : "Run for the hills",
    startDate : new Date(2018, 7, 7),
    endDate : new Date(2018, 7, 17),
    daysNeeded : 7
  },
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
    createdOn : new Date(1986,3,7)
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
    createdOn : new Date(1999,1,1)
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
    createdOn : new Date(2003,3,3)
  },
  {
    legalEntity : "Modified Explosives Inc.",
    businessId : "5315315-3",
    contactPerson : "Modded McModiface",
    email : "modified_email@sauma.io",
    phone : "531-531-531",
    address : {
      street : "531 Modified Street",
      zipCode : "531531",
      city : "Modificationtown",
      country : "Modificzstan"
    },
    createdOn : new Date(1979,7,9)
  },
  {
    legalEntity : "Not the Same Explosives Inc.",
    businessId : "3333333-3",
    contactPerson : "Not the McSameface",
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
    legalEntity : "Revised Explosives Inc.",
    businessId : "5555555-5",
    contactPerson : "Revised McReviseface",
    email : "revised_email@sauma.io",
    phone : "555 555 555",
    address : {
      street : "55 Revision Street",
      zipCode : "50505",
      city : "Revisiontown",
      country : "Revised Kingdom"
    },
    createdOn : new Date(2011,11,11)
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
    createdOn : new Date(2006,6,6)
  }
]

const updateEmployees = [
  {
    username : "altered_username",
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
    pwHash : "$2a$10$Z2cZgvEb7tFVkGA32Wne4.0eq8AYXKhxIj96CZIOX//T5fe0BG9Wi",
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
    username : "modified_username",
    pwHash : "$2a$10$6zOLtcxE0lxd.Oy/xGInu.QC/lMwauOif0LJ94v6BAssP3dJ2ZF8e",
    firstName : "Modified firstName",
    lastName : "Modified lastName",
    email : "modified_email@sauma.io",
    phone : "531-531-531",
    address : {
      street : "531 Modified Street",
      zipCode : "531531",
      city : "Modificationtown",
      country : "Modificzstan"
    },
    createdOn : new Date(1979,7,9)
  },
  {
    username : "not_the_same_username",
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
    username : "revised_username",
    firstName : "Revised firstName",
    lastName : "Revised lastName",
    email : "revised@sauma.io",
    phone : "555-555-555",
    address : {
      street : "55 Revision Street",
      zipCode : "50505",
      city : "Revisiontown",
      country : "Revised Kingdom"
    },
    createdOn : new Date(2011,11,11)
  },
  {
    username : "updated_username",
    pwHash : "$2a$10$UyK5sPmD8F1k.ck73xZd0en9XddW0jN55V.rWI08liCrhx5NvUW1e",
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

const updateMaterials = [
  {
    name : "Altered name",
    unit : "sqm",
    unitCost : 13.37,
    createdOn : new Date(1986,3,7)
  },
  {
    name : "Changed name",
    unit : "sqm",
    unitCost : 13.37,
    createdOn : new Date(1999,1,1)
  },
  {
    name : "Different name",
    unit : "sqm",
    unitCost : 13.37,
    createdOn : new Date(2003,3,3)
  },
  {
    name : "Modified name",
    unit : "sqm",
    unitCost : 13.37,
    createdOn : new Date(1979,7,9)
  },
  {
    name : "Not the same name",
    unit : "sqm",
    unitCost : 13.37,
    createdOn : new Date(1993,9,9)
  },
  {
    name : "Revised name",
    unit : "sqm",
    unitCost : 13.37,
    createdOn : new Date(2011,11,11)
  },
  {
    name : "Updated name",
    unit : "sqm",
    unitCost : 13.37,
    createdOn : new Date(2006,6,6)
  }
]

const updateProjects = [
  {
    projectId : "altered_project",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    address : {
      street : "480 Altered Avenue",
      zipCode : "40404",
      city : "Altertown",
      country : "Alterstan"
    },
    createdOn : new Date(1986,3,7)
  },
  {
    projectId : "changed_project",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    address : {
      street : "313 Changed Street",
      zipCode : "00000",
      city : "Changedtown",
      country : "Changedstan"
    },
    createdOn : new Date(1999,1,1)
  },
  {
    projectId : "different_project",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    address : {
      street : "313 Different Avenue",
      zipCode : "30303",
      city : "Differenttown",
      country : "Differentland"
    },
    createdOn : new Date(2003,3,3)
  },
  {
    projectId : "modified_project",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    address : {
      street : "531 Modified Street",
      zipCode : "531531",
      city : "Modificationtown",
      country : "Modificzstan"
    },
    createdOn : new Date(1979,7,9)
  },
  {
    projectId : "not_the_same_project",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    address : {
      street : "99 Not the Same Street",
      zipCode : "90909",
      city : "Not the same town",
      country : "Not the Same States of America"
    },
    createdOn : new Date(1993,9,9)
  },
  {
    projectId : "revised_project",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    address : {
      street : "99 Not the Same Street",
      zipCode : "90909",
      city : "Not the same town",
      country : "Not the Same States of America"
    },
    createdOn : new Date(2011,11,11)
  },
  {
    projectId : "updated_project",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    address : {
      street : "444 Updated Street",
      zipCode : "44444",
      city : "Updateville",
      country : "Updated States of America"
    },
    createdOn : new Date(2006,6,6)
  }
]

const updateTasks = [
  {
    description : "Alter some stuff",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    daysNeeded : 42,
    createdOn : new Date(1986,3,7)
  },
  {
    description : "Change some stuff",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    daysNeeded : 42,
    createdOn : new Date(1999,1,1)
  },
  {
    description : "Do some stuff differently",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    daysNeeded : 42,
    createdOn : new Date(2003,3,3)
  },
  {
    description : "Modify some stuff",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    daysNeeded : 42,
    createdOn : new Date(1979,7,9)
  },
  {
    description : "Do not do the same stuff this time",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    daysNeeded : 42,
    createdOn : new Date(1993,9,9)
  },
  {
    description : "Revise some stuff",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    daysNeeded : 42,
    createdOn : new Date(2011,11,11)
  },
  {
    description : "Update some stuff",
    startDate : new Date(1999, 9, 9),
    endDate : new Date(2042, 4, 2),
    daysNeeded : 42,
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

const validHashes = [
  "$2a$10$AHMSsWzm//1w6Lqqgip9huS4KEbODZOS..ZMu1bfhB5gJsumYz1E2",
  "$2a$10$Z2cZgvEb7tFVkGA32Wne4.0eq8AYXKhxIj96CZIOX//T5fe0BG9Wi",
  "$2a$10$7T64SlPwpDjHy.i7gAtNKOqJbhM1b3ghWNOy6/3Q9kS1A03pyl146",
  "$2a$10$6zOLtcxE0lxd.Oy/xGInu.QC/lMwauOif0LJ94v6BAssP3dJ2ZF8e",
  "$2a$10$pntUrZDmf/1ZAoUy4JIP2ukjizWcHK70DujbrAZPoqwpC.XB6UHLK",
  "$2a$10$UyK5sPmD8F1k.ck73xZd0en9XddW0jN55V.rWI08liCrhx5NvUW1e",
  "$2a$10$uceoVJPEuKxQw/i5TEo7cOkL8UzEu1ay.Fcte.pQkxGHooJEb8GOK"
]

module.exports = {
  initClients,
  initEmployees,
  initMaterials,
  initProjects,
  initTasks,
  invalidClients,
  invalidClientUpdates,
  invalidCredentials,
  invalidEmployees,
  invalidEmployeeUpdates,
  invalidMaterials,
  invalidMaterialUpdates,
  invalidProjects,
  invalidProjectUpdates,
  invalidTasks,
  invalidTaskUpdates,
  newClients,
  newEmployees,
  newMaterials,
  newProjects,
  newTasks,
  updateClients,
  updateEmployees,
  updateMaterials,
  updateProjects,
  updateTasks,
  validAddresses,
  validHashes
}
