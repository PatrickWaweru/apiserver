const Sequelize = require('sequelize')
// const finale = require('finale-rest')
// Importing crypto module
const crypto = require('crypto')
const { faker } = require('@faker-js/faker');

// const database = new Sequelize({
//   dialect: 'sqlite',
//   storage: './test.sqlite'
// })

// getting a random RFC 4122 Version 4 UUID
// by using randomUUID() method
const val = crypto.randomUUID({disableEntropyCache : true});

// display the result
console.log("RFC 4122 Version 4 UUID : " + val)

const database = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_IP,
  port: process.env.DB_PORT,
  dialect: 'mysql'
})

database
  .authenticate()
  .then(() => {
    console.log('Connected to the database !')
  })
  .catch(err => {
    console.log('Error unable to connect to the database !' + err)
  })

const Part = database.define('parts', {
  partNumber: Sequelize.STRING,
  modelNumber: Sequelize.STRING,
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

//generate fake part data
function generateFakePartData() {
    //number of records to generate
    const totalRecords = 50
    const data = []
    //loop
    for (var i = 0; i < totalRecords; ++i) {
        let stub = { partNumber: faker.lorem.slug(), modelNumber: faker.lorem.slug(), name: faker.lorem.sentence(), description: faker.lorem.paragraph() }
        data.push(stub)
    }
    return(data)
}

const Prediction = database.define('predictions', {
  code: Sequelize.BIGINT,
  Name: Sequelize.STRING,
  id: Sequelize.STRING,
  PatientPID: Sequelize.BIGINT,
  PatientCccNumber: Sequelize.BIGINT,
  Gender: Sequelize.STRING,
  DOB: Sequelize.DATE,
  LiveRowId: Sequelize.BIGINT,
  risk_score: Sequelize.DECIMAL(16,2),
  FacilityCode: Sequelize.BIGINT,
  prediction_id: {

    // Big Integer Datatype
    type: Sequelize.BIGINT,

    // Increment the value automatically
    autoIncrement: true,

    // prediction_id can not be null.
    allowNull: false,

    // To uniquely identify user
    primaryKey: true
  }
})

//generate fake prediction data
function generateFakePredictionData() {
    const numFacilityCode = 14063
    const strFacilityName = 'Rwambwa Sub-county Hospital'
    //number of records to generate
    const totalRecords = 50
    const data = []
    //loop
    for (var i = 0; i < totalRecords; ++i) {
        let stub = { code: numFacilityCode, Name: strFacilityName, id: crypto.randomUUID({disableEntropyCache : true}), PatientPID: faker.datatype.number({ min: 1000, max: 10000000000, precision: 1 }), PatientCccNumber: faker.datatype.number({ min: 1000, max: 10000000000, precision: 1 }), Gender: faker.name.gender(true), DOB: faker.date.between('1930-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'), LiveRowId: faker.datatype.number({ min: 1000, max: 10000000000, precision: 1 }), risk_score: faker.datatype.float({ min: 0.01, max: 0.99, precision: 0.01 }), FacilityCode: numFacilityCode }
        data.push(stub)
    }
    return(data)
}

const initializeDatabase = async (app) => {
  //   finale.initialize({ app, sequelize: database })

  //  var partsResource = finale.resource({
  //     model: Part,
  //     endpoints: ['/parts', '/parts/:id'],
  //     pagination: true
  //   })

  // await database.sync().

  await database.sync({ force: false,  alter: true})
    .then(() => {
      const partData = generateFakePartData()
      Part.bulkCreate(partData).then(function () {
        return Part.findAll()
      }).then(function (parts) {
        console.log(parts)
      })
      console.log('Parts Database & Tables created!')
    })
    .then(() => {
      const predictionData = generateFakePredictionData()
      Prediction.bulkCreate(predictionData)
      .then(function () {
        return Prediction.findAll()
      }).then(function (prediction) {
        console.log(prediction)
      })
      console.log('Prediction Database & Tables created!')
    })
    .catch(err => {
      console.log('Error unable to create Database & Tables!' + err)
    })
}

module.exports = { initializeDatabase, Part, Prediction }
// module.exports = initializeDatabase
