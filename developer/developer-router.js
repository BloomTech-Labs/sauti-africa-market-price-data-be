const express = require('express');

const Developer = require('./developer-model.js');
const router = express.Router();

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
router.get('/latest', (req, res) => {
    Developer.latestPrice(req.query).then(records => {
        res.status(200).json(records)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})
//getting the latest price of a product from a specific market
router.get('/latestmarket', (req, res) => {
    Developer.latestPriceByMarket(req.query).then(records => {
        res.status(200).json(records)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})


module.exports = router;