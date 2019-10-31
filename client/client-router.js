const express = require('express')
const tokenMiddleware = require('../middleware/token-middleware')

const Client = require('./client-model.js')
const router = express.Router()

router.get('/', tokenMiddleware, (req, res) => {
  Client.getSautiDataClient(req.query)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

router.get('/lists', (req, res) => {
  Developer.getListsOfThings(req.query.list)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

module.exports = router
