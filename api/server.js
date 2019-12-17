const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const server = express()

const Client = require('../client/client-model')
const Validate = require('../middleware/validate')

const DBSt = require('../database/dbSTConfig')
const apikeyRoute = require('../routes/apikeyRoute')
const apiAuthenticator = require('../middleware/apikey-middleware')
const apiLimiter = require('../middleware/api-limiter-middleware')
const devRouter = require('../developer/developer-router.js')
const clientRouter = require('../client/client-router.js')
const tokenmiddleware = require('../middleware/token-middleware')

//Initialize Moesif and set up the middleware
const moesifExpress = require('moesif-express')
const moesifMiddleware = moesifExpress({
  applicationId: process.env.MOESIF_ID || undefined,
  logBody: true
})

//Server uses middleware to add functionality
server.use(moesifMiddleware)

server.use(compression())
server.use(helmet())
server.use(cors())
server.use(express.json())

server.use('/api/apikeyRoute', apikeyRoute)

server.use('/sauti/developer', apiAuthenticator, apiLimiter, devRouter)
server.use('/sauti/client', clientRouter)

server.get('/', (req, res) => {
  res.send(
    "<h1>Welcome to Sauti Africa Market Price API</h1><a href='https://price-api.sautiafrica.org/docs'>Check out the API Docs on how to use this API</a>"
  )
})

// playground route for faux filter //
server.get('/sauti', (req, res) => {
  Client.getPlay(req.query)
    .then(response => {
      res.status(200).json(response)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

// TODO: CLEAN UP TEMP CODE AFTER FINISHED WRITING MIDDLEWARE FOR API
const managementToken = require('../middleware/rules/API-Token.js')
managementToken();

module.exports = server