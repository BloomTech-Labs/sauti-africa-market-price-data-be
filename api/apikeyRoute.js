const express = require("express")
const router = express.Router()
const jwt = require("express-jwt")
const jwtAuthz = require("express-jwt-authz")
const jwks = require("jwks-rsa")
const uuidAPIKey = require("uuid-apikey")

const db = require("../api-key/dbConfig")

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "http://sauti-africa-market-prices.auth0.com/.well-known/jwks.json"
  }),
  audience: "https://sauti-africa-market-prices.auth0.com/api/v2/",
  issuer: "http://sauti-africa-market-prices.auth0.com/",
  algorithms: ["RS256"]
})

router.get("/private", jwtCheck, async (req, res) => {
  const key = uuidAPIKey.create()
  await db("api-key").insert({ key })
  res.status(200).json({ key: key.apiKey })
})

module.exports = router
