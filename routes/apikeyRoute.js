const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const uuidAPIKey = require("uuid-apikey");
const bcrypt = require("bcryptjs");

const db = require("../api-key/dbConfig");

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri:
      "https://sauti-africa-market-prices.auth0.com/.well-known/jwks.json"
  }),
  audience: "https://sauti-africa-market-prices.auth0.com/api/v2/",
  issuer: "https://sauti-africa-market-prices.auth0.com/",
  algorithms: ["RS256"]
});

router.post("/private", jwtCheck, async (req, res) => {
  const key = uuidAPIKey.create();
  const { id } = req.body;

  const user = await db("apiKeys")
    .where({ user_id: id })
    .first();

  bcrypt.hash(key.apiKey, 10, async function(err, hash) {
    if (hash) {
      if (user) {
        await db("apiKeys")
          .where({ user_id: id })
          .update({ key: hash });
        res.status(200).json({ existed: true, key: key.apiKey });
      } else {
        try {
          console.log("no user");
          await db("apiKeys").insert({ key: hash, user_id: id });
          res.status(200).json({ existed: false, key: key.apiKey });
        } catch (err) {
          console.log(err);
        }
      }
    }
    if (err) {
      res.status(500).json({ message: "Key could not be hashed" });
    }
  });
});

module.exports = router;
