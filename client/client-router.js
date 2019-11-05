const express = require('express')
const tokenMiddleware = require('../middleware/token-middleware')
const { queryCurrency } = require('../middleware/validate')

const Client = require('./client-model.js')
const router = express.Router()

const convertCurrencies = require('../currency')

router.get('/', queryCurrency, tokenMiddleware, (req, res) => {
  Client.getSautiDataClient(req.query)
    .then(records => {
      convertCurrencies(records, req.currency)
        .then(converted => {
          res.status(200).json({
            warning: converted.warning,
            message: req.message,
            records: converted.data,
            ratesUpdated: converted.ratesUpdated
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

router.get('/lists', (req, res) => {
  Client.getListsOfThings(req.query.list)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})
router.get('/superlist', (req, res) => {
  Client.mcpList()
  .then(records => {
    res.status(200).json(records)
  })
  .catch(err => {
    console.log(err.message)
    res.status(500).send(err.message)

  })
})

module.exports = router
