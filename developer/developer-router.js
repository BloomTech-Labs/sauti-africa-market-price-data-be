const express = require("express")

const Developer = require("./developer-model.js")
const router = express.Router()

// Giant filter router
router.get("/", (req, res) => {
  Developer.getSautiData(req.query)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

//getting the latest market price for a product across all markets
router.get("/latest", (req, res) => {
  Developer.latestPriceAcrossAllMarkets(req.query)
    .then(records => {
      res.status(200).json(records[0])
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

//getting the latest price of a product from a specific market
//Requires product & market names as string
router.get("/latestmarket", (req, res) => {
  Developer.latestPriceByMarket(req.query)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

//Getting list of products from product column
router.get("/products", (req, res) => {
  Developer.getProducts()
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

//Get list of unique markets
router.get("/markets", (req, res) => {
  Developer.getMarkets()
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

//get list of unique countries (returns currency type respective to its country)
router.get("/countries", (req, res) => {
  Developer.getCountries()
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
router.get("/products/range", (req, res) => {
  const { product, startDate, endDate } = req.query
  Developer.getProductPriceRange(product, startDate, endDate)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

//URL needs to have keys: count and page at
//records returns all rows as per number of records in each page
//default is 20 records per page
router.get("/records", (req, res) => {
  const { count, page } = req.query
  Developer.getAllRecords(count, page)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

module.exports = router
