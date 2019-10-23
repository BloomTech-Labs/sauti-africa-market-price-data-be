const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const uuidAPIKey = require('uuid-apikey')

const db = require('../api-key/dbConfig')

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri:
      'https://sauti-africa-market-prices.auth0.com/.well-known/jwks.json'
  }),
  audience: "https://sauti-africa-market-prices.auth0.com/api/v2/",
  issuer: "https://sauti-africa-market-prices.auth0.com/",
  algorithms: ["RS256"]
});

router.post("/private", jwtCheck, async (req, res) => {
  const key = uuidAPIKey.create();
  const { id } = req.body;
  console.log({ ID: id });
  const user = await db("apiKeys")
    .where({ user_id: id })
    .first();
  console.log({ here: user });
  if (user) res.status(200).json({ existed: true, key: user.key });
  else {
    try {
      console.log("no user");
      await db("apiKeys").insert({ key: key.apiKey, user_id: id });
      res.status(200).json({ existed: false, key: key.apiKey });
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = router;
