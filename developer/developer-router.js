const express = require('express')
const validate = require('../middleware/validate.js')
const Developer = require('./developer-model.js')
const router = express.Router()
const convertCurrencies = require('../currency')

// Giant filter router
router.get(
  '/filter',
  validate.queryCurrency,
  validate.queryCountPage,
  (req, res) => {
    Developer.getSautiData(req.query)
      .then(response => {
        if (!response.records || response.records.length < 1) {
          res.status(404).json({
            message:
              "Records don't exist here, change the query parameters or change page no. "
          })
        } else {
          convertCurrencies(response, req.currency)
            .then(converted => {
              converted.count
                ? res.status(200).json({
                    warning: converted.warning,
                    message: req.message,
                    records: converted.data,
                    ratesUpdated: converted.ratesUpdated,
                    next: converted.next,
                    topPageValue: converted.prev,
                    pageCount: converted.count[0]['count(*)']
                  })
                : res.status(200).json({
                    warning: converted.warning,
                    message: req.message,
                    records: converted.data,
                    ratesUpdated: converted.ratesUpdated,
                    next: converted.next,
                    topPageValue: converted.prev
                  })
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
      .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
      })
  }
)

//getting the latest market price for a product across all markets
router.get(
  '/product/latestprice',
  validate.queryCurrency,
  validate.queryProduct,
  (req, res) => {
    Developer.latestPriceAcrossAllMarkets(req.query)
      .then(records => {
        if (!records[0] || records[0].length < 1) {
          res.status(404).json({
            message:
              "The product entered doesn't exist in the database, please check the list of available products"
          })
        } else {
          convertCurrencies(records[0], req.currency)
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
        }
      })
      .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
      })
  }
)

//getting the latest price of a product from a specific market
//Requires product & market names as string
router.get(
  '/product/pricebymarket',
  validate.queryCurrency,
  validate.queryProductMarket,
  (req, res) => {
    Developer.latestPriceByMarket(req.query)
      .then(record => {
        if (record) {
          convertCurrencies(record, req.currency)
            .then(converted => {
              res.status(200).json({
                warning: converted.warning,
                message: req.message,
                record: converted.data,
                ratesUpdated: converted.ratesUpdated
              })
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          res.status(404).json({
            message:
              "That product and market combination doesn't exist, please check spelling and list of products and markets"
          })
        }
      })
      .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
      })
  }
)

//Pass a string as query for specific list - market,source,country,products
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

//Req.query needs product,startDate,endDate and returns a range of records
//startDate is older than endDate
//requires further validation possibly with moment.js to validate the date values//stretch goal for later
router.get(
  '/product/range',
  validate.queryCurrency,
  validate.queryProductDate,
  validate.queryCountPage,
  (req, res) => {
    Developer.getProductPriceRange(req.query)
      .then(records => {
        convertCurrencies(records, req.currency)
          .then(converted => {
            converted.count
              ? res.status(200).json({
                  warning: converted.warning,
                  message: req.message,
                  records: converted.data,
                  ratesUpdated: converted.ratesUpdated,
                  next: converted.next,
                  topPageValue: converted.prev,
                  pageCount: converted.count[0]['count(*)']
                })
              : res.status(200).json({
                  warning: converted.warning,
                  message: req.message,
                  records: converted.data,
                  ratesUpdated: converted.ratesUpdated,
                  next: converted.next,
                  topPageValue: converted.prev
                })
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        res.status(500).send(error.message)
      })
  }
)

module.exports = router
