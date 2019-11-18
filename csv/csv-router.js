const express = require("express");
const router = express.Router();
const { queryCurrency } = require("../middleware/validate");
const tokenMiddleware =
  process.env.npm_lifecycle_event !== "dev"
    ? require("../middleware/token-middleware")
    : function(req, res, next) {
        next();
      };
const CSV = require("./csv-model.js");

const convertCurrencies = require("../currency");

router.get("/", tokenMiddleware, queryCurrency, (req, res) => {
  CSV.getSautiDataCSV(req.query)
    .then(records => {
      convertCurrencies(records, req.currency)
        .then(converted => {
          res.status(200).json({
            warning: converted.warning,
            message: req.message,
            records: converted.data,
            ratesUpdated: converted.ratesUpdated
          });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error.message);
    });
});

module.exports = router;
