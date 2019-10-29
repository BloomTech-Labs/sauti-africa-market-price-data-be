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
      .then(records => {
        if (!records || records.length < 1) {
          res.status(404).json({
            message:
              "Records don't exist here, change the query parameters or change page no. "
          })
        } else {
          convertCurrencies(records, req.currency)
            .then(converted => {
              res.status(200).json({ message: req.message, records: converted })
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
              res.status(200).json(converted)
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
      .then(records => {
        if (records) {
          convertCurrencies(records, req.currency)
            .then(converted => {
              res.status(200).json(converted)
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
    const { product, startDate, endDate, page, count } = req.query
    Developer.getProductPriceRange(product, startDate, endDate, count, page)
      .then(records => {
        convertCurrencies(records, req.currency)
          .then(converted => {
            res.status(200).json({ message: req.message, records: converted })
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

//URL needs to have keys: count and page at
//records returns all rows as per number of records in each page
//default is 20 records per page
// router.get("/records", validate.queryCountPage, (req, res) => {
//   const { count, page } = req.query
//   Developer.getAllRecords(count, page)
//     .then(records => {
//       res.status(200).json({ message: req.message, records: records })
//     })
//     .catch(error => {
//       console.log(error)
//       res.status(500).send(error.message)
//     })
// })

//Getting list of products from product column
// router.get("/products", (req, res) => {
//   Developer.getProducts()
//     .then(records => {
//       res.status(200).json(records)
//     })
//     .catch(error => {
//       console.log(error)
//       res.status(500).send(error.message)
//     })
// })
// //Kathryn attempt
// router.get('/kathryn', (req, res)=> {
//   Developer.kathrynAttempt(req.query).then(
//     records => {
//       res.status(200).json(records)
//     }
//   )
//   .catch(err => {
//     console.log(err)
//     res.status(500).send(err.message)
//   })
// })

//Get list of unique markets
// router.get("/markets", (req, res) => {
//   Developer.getMarkets()
//   .then(records => {
//     res.status(200).json(records)
//   })
//   .catch(error => {
//     console.log(error)
//     res.status(500).send(error.message)
//   })
// })

//get list of unique countries (returns currency type respective to its country)
// router.get("/countries", (req, res) => {
//   Developer.getCountries()
//     .then(records => {
//       res.status(200).json(records)
//     })
//     .catch(error => {
//       console.log(error)
//       res.status(500).send(error.message)
//     })
// })

module.exports = router
