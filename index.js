require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const authMiddleware = require('./auth')
const { initializeDatabase } = require('./database')
const { Part } = require('./database')
const { Prediction } = require('./database')
const crypto = require('crypto')
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/default.key', 'utf8');
var certificate = fs.readFileSync('sslcert/default.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const app = express()
app.use(bodyParser.json())
app.use(authMiddleware)

// calculate the offset and limit for pagination
function getPagination (pageNumber, pageSize, totalItems) {
  let offset = 0
  let limit = 0
  let pagecount = 0
  limit = pageSize // the limit is the page size
  console.log('Limit is: ' + limit)
  // offset = ((pageNumber * pageSize) - 1) // count starts at zero
  // (page - 1) * itemsPerPage + 1
  // offset = (pageNumber - 1) * (pageSize + 1) // fails
  offset = (pageSize * pageNumber) - pageSize // works
  // offset = (pageNumber - 1) * (pageSize) // works
  console.log('Offset is: ' + offset)
  pagecount = Math.ceil(totalItems / pageSize) // raise to the highest integer
  console.log('pagecount is: ' + pagecount)
  return { offset, limit, pagecount }
}

// start the server
const startServer = async () => {
  await initializeDatabase(app)
  app.get('/', (req, res) => res.send('<html><head><title>Risk Score Predictions</title></head><body><p>Risk Score Predictions</p></body></html>'))
  app.get('/parts', function (req, res) {
    const pageNumber = ((parseInt(req.query.pageNumber) > 0) ? parseInt(req.query.pageNumber) : 1)
    const pageSize = ((parseInt(req.query.pageSize) > 0) ? parseInt(req.query.pageSize) : 100)
    console.log('pageNumber: ' + pageNumber + ' pageSize: ' + pageSize)
    // query the DB
    Part
      .count()
      .then(counter => {
        console.log('There are ' + counter + ' parts!')
        return (counter)
      })
      .then((totalItems) => {
        const { offset, limit, pagecount } = getPagination(pageNumber, pageSize, totalItems)
        console.log('offset: ' + offset + ' limit: ' + limit + ' pagecount: ' + pagecount)
        Part
          // .findAll({ offset: offset, limit: limit })
          .findAndCountAll({ offset: offset, limit: limit })
          // .then(function (parts) {
          .then(function (result) {
            const o = {} // empty Object
            const pNum = 'pageNumber' // page number
            const pSize = 'pageSize' // page size
            const pCount = 'pageCount' // page count
            const iCount = 'totalItemCount' // total item count
            const data = 'extract' // data
            // add data
            o[pNum] = pageNumber
            o[pSize] = pageSize
            o[pCount] = pagecount
            o[iCount] = result.count
            // o[data] = parts
            o[data] = result.rows

            res.json(o)
          })
      })
  })
  app.get('/parts/:id', function (req, res) {
    Part.findAll({ where: { id: req.params.id } }).then(notes => res.json(notes))
  })
  app.get('/predictions', function (req, res) {
    const pageNumber = ((parseInt(req.query.pageNumber) > 0) ? parseInt(req.query.pageNumber) : 1)
    const pageSize = ((parseInt(req.query.pageSize) > 0) ? parseInt(req.query.pageSize) : 100)
    console.log('pageNumber: ' + pageNumber + ' pageSize: ' + pageSize)
    // query the DB
    Prediction
      .count()
      .then(counter => {
        console.log('There are ' + counter + ' predictions!')
        return (counter)
      })
      .then((totalItems) => {
        const { offset, limit, pagecount } = getPagination(pageNumber, pageSize, totalItems)
        console.log('offset: ' + offset + ' limit: ' + limit + ' pagecount: ' + pagecount)
        Prediction
          // .findAll({ offset: offset, limit: limit })
          .findAndCountAll({ offset: offset, limit: limit })
          // .then(function (parts) {
          .then(function (result) {
            const o = {} // empty Object
            const pNum = 'pageNumber' // page number
            const pSize = 'pageSize' // page size
            const pCount = 'pageCount' // page count
            const iCount = 'totalItemCount' // total item count
            const data = 'extract' // data
            // add data
            o[pNum] = pageNumber
            o[pSize] = pageSize
            o[pCount] = pagecount
            o[iCount] = result.count
            // o[data] = parts
            o[data] = result.rows

            res.json(o)
          })
      })
  })
  app.get('/predictions/search', function (req, res) {
    const pageNumber = ((parseInt(req.query.pageNumber) > 0) ? parseInt(req.query.pageNumber) : 1)
    const pageSize = ((parseInt(req.query.pageSize) > 0) ? parseInt(req.query.pageSize) : 100)
    const facilityCode = ((parseInt(req.query.facilityCode) > 0) ? parseInt(req.query.facilityCode) : 14063)
    console.log('pageNumber: ' + pageNumber + ' pageSize: ' + pageSize)
    // Test UUID
    // getting a random RFC 4122 Version 4 UUID
    // by using randomUUID() method
    const val = crypto.randomUUID({disableEntropyCache : true});

    // display the result
    console.log("RFC 4122 Version 4 UUID : " + val)
    // query the DB
    Prediction
      .count({ where: { FacilityCode: facilityCode } })
      .then(counter => {
        console.log('There are ' + counter + ' predictions!')
        return (counter)
      })
      .then((totalItems) => {
        const { offset, limit, pagecount } = getPagination(pageNumber, pageSize, totalItems)
        console.log('offset: ' + offset + ' limit: ' + limit + ' pagecount: ' + pagecount)
        Prediction
          // .findAll({ offset: offset, limit: limit })
          .findAndCountAll({ offset: offset, limit: limit, where: { FacilityCode: facilityCode } })
          // .then(function (parts) {
          .then(function (result) {
            const o = {} // empty Object
            const pNum = 'pageNumber' // page number
            const pSize = 'pageSize' // page size
            const pCount = 'pageCount' // page count
            const iCount = 'totalItemCount' // total item count
            const data = 'extract' // data
            // add data
            o[pNum] = pageNumber
            o[pSize] = pageSize
            o[pCount] = pagecount
            o[iCount] = result.count
            // o[data] = parts
            o[data] = result.rows

            res.json(o)
          })
      })
  })
  app.get('/predictions/:id', function (req, res) {
    Prediction.findAll({ where: { id: req.params.id } }).then(predictions => res.json(predictions))
  })
  const http_port = process.env.HTTP_SERVER_PORT || 3000
  const https_port = process.env.HTTPS_SERVER_PORT || 3080

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  //   await promisify(app.listen).bind(app)(http_port)
  await promisify(httpServer.listen).bind(httpServer)(http_port)
  await promisify(httpsServer.listen).bind(httpsServer)(https_port)

  console.log(`APIserver Listening on HTTP port ${http_port}`)
  console.log(`APIserver Listening on HTTPS port ${https_port}`)
  console.log('Mocks DWH Machine Learning predictions endpoint')
}

startServer()
