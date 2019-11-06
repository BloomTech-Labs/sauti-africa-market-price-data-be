const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const DBSt = require("../database/dbSTConfig");
const apikeyRoute = require("../routes/apikeyRoute");
const apiAuthenticator = require("../middleware/apikey-middleware");
const apiLimiter = require("../middleware/api-limiter-middleware");
const devRouter = require("../developer/developer-router.js");
const clientRouter = require("../client/client-router.js");

const server = express();
//Initialize Moesif and set up the middleware
const moesifExpress = require("moesif-express");
const moesifMiddleware = moesifExpress({
  applicationId: process.env.MOESIF_ID || undefined,
  logBody: true
});

//Server uses middleware to add functionality
server.use(moesifMiddleware);

server.use(compression());
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/apikeyRoute", apikeyRoute);

server.use("/sauti/developer", apiAuthenticator, apiLimiter, devRouter);
server.use("/sauti/client", clientRouter);

server.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to Sauti Africa Market Price API</h1><a href='https://documenter.getpostman.com/view/8666055/SVtZvkxB?version=latest#379d2949-1e20-47be-9f13-9d142581a8c9'>Check out the API Docs on how to use this API</a>"
  );
});

function getThings() {
  return DBSt("platform_market_prices")
    .where()
    .orderBy("date")
    .limit(1);
}

server.get("/sauti", apiAuthenticator, apiLimiter, (_req, res) => {
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
