const express = require("express")
const router = express.Router()
const jwt = require("express-jwt")
const jwks = require("jwks-rsa")
const uuidAPIKey = require("uuid-apikey")

const db = require("../api-key/dbConfig")

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      "https://sauti-africa-market-prices.auth0.com/.well-known/jwks.json"
  }),
  audience: "https://sauti-africa-market-prices.auth0.com/api/v2/",
  issuer: "https://sauti-africa-market-prices.auth0.com/",
  algorithms: ["RS256"]
})

router.get("/private", jwtCheck, async (req, res) => {
  const key = uuidAPIKey.create()
  try {
    await db("apiKeys").insert({ key: key.apiKey })
    res.status(200).json({ key: key.apiKey })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
