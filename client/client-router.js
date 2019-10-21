const express = require("express")

const Client = require("./client-model.js")
const router = express.Router()

router.get("/", (req, res) => {
  Client.getSautiDataClient(req.query)
    .then(records => {
      res.status(200).json(records)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error.message)
    })
})

module.exports = router
