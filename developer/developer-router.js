const express = require('express');

const Developer = require('./developer-model.js');
const router = express.Router();

// Giant filter router 
router.get('/', (req, res) => {
    Developer.getSautiData(req.query).then(records => {
        res.status(200).json(records)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})

//getting the latest market price for a product across all markets
//** Note that there is currently an error with this route. Does not return latest price for each market **/
router.get('/latest', (req, res) => {
    Developer.latestPriceAcrossAllMarkets(req.query).then(records => {
        res.status(200).json(records)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})

//getting the latest price of a product from a specific market
//Requires product & market names as string
router.get('/latestmarket', (req, res) => {
    Developer.latestPriceByMarket(req.query).then(records => {
        res.status(200).json(records)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})

//Getting list of products from product column
router.get('/products', (req,res)=>{
    Developer.getProducts().then(records => {
        res.status(200).json(records)
    }).catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})

//Get list of unique markets
router.get('/markets', (req,res)=>{
    Developer.getMarkets().then(records => {
        res.status(200).json(records)
    }).catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})

//get list of unique countries (returns currency type respective to its country)
router.get('/countries', (req, res) => {
    Developer.getCountries().then(records => {
        res.status(200).json(records)
    }).catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })

})
//get list of unique ????


module.exports = router;