const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const DBSt = require("../database/dbSTConfig");

const server = express();

//Initialize Moesif and set up the middleware
const moesifExpress = require("moesif-express");
const moesifMiddleware = moesifExpress({
  applicationId: process.env.MOESIF_ID,
  logBody: true
});

//Server uses middleware to add functionality
server.use(moesifMiddleware);
server.use(helmet());
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("working in my test server");
});
function getThings() {
  return DBSt("platform_market_prices")
    .orderBy("date")
    .limit(10);
}
server.get("/sauti", (req, res) => {
  getThings()
    .then(records => {
      res.status(200).json(records);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error.message);
    });
});

module.exports = server;
