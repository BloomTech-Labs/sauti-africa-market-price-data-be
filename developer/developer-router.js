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

module.exports = router;