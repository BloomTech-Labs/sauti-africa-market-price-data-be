const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')

const Client = require('../client/client-model')
const Validate = require('../middleware/validate')

const DBSt = require('../database/dbSTConfig')
const apikeyRoute = require('../routes/apikeyRoute')
const apiAuthenticator = require('../middleware/apikey-middleware')
const apiLimiter = require('../middleware/api-limiter-middleware')
const devRouter = require('../developer/developer-router.js')
const clientRouter = require('../client/client-router.js')
const tokenmiddleware = require('../middleware/token-middleware')
const server = express()
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
    "<h1>Welcome to Sauti Africa Market Price API</h1><a href='https://documenter.getpostman.com/view/8666055/SVtZvkxB?version=latest#379d2949-1e20-47be-9f13-9d142581a8c9'>Check out the API Docs on how to use this API</a>"
  )
})

async function getThings(cursor) {
  let entries

  if (cursor.next && cursor.prev)
    throw { message: 'Cannot use next and prev at the same time!' }

  if (cursor.next) {
    const cursorArray = cursor.next.split('_')
    const nextDate = cursorArray[0]
    const nextId = cursorArray[1]
    entries = await DBSt('platform_market_prices2')
      .where(function() {
        this.whereRaw('id < ?', [nextId]).andWhereRaw('date <= ?', [nextDate])
      })
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .limit(1)
  } else if (cursor.prev) {
    const cursorArray = cursor.prev.split('_')
    const prevDate = cursorArray[0]
    const prevId = cursorArray[1]
    const limit = Number(prevId) + 3
    const stringLim = limit.toString()
    entries = await DBSt('platform_market_prices2')
      .whereRaw('id > ?', [prevId])
      .andWhereNot(function() {
        this.whereRaw('id > ?', [stringLim])
      })
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .limit(1)
  } else if (!cursor.next && !cursor.prev) {
    entries = await DBSt('platform_market_prices2')
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .limit(1)
  }

  const firstEntry = entries[0]
  const lastEntry = entries[entries.length - 1]
  entries.length
    ? (prev = `${firstEntry.date}_${firstEntry.id}`)
    : (prev = null)
  entries.length ? (next = `${lastEntry.date}_${lastEntry.id}`) : (next = null)

  return { records: entries, next: next, prev: prev }
}

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

module.exports = server
