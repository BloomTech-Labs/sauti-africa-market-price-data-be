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

//Get list of unique products

//Get list of unique markets

//get list of unique countries (returns currency type respective to its country)

//get list of unique 

//get the latest price on a product

module.exports = router;