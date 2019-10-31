const express = require('express')
const router = express.Router()
// const jwt = require('express-jwt')
// const jwks = require('jwks-rsa')
const uuidAPIKey = require('uuid-apikey')
const bcrypt = require('bcryptjs')

const db = require('../api-key/dbConfig')

// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 10,
//     jwksUri:
//       'https://sauti-africa-market-prices.auth0.com/.well-known/jwks.json'
//   }),
//   audience: 'https://sauti-africa-market-prices.auth0.com/api/v2/',
//   issuer: 'https://sauti-africa-market-prices.auth0.com/',
//   algorithms: ['RS256']
// })

const jwtCheck = require('../middleware/token-middleware')

router.post('/private', jwtCheck, async (req, res) => {
  const key = uuidAPIKey.create()
  const { id } = req.body
  const hash = digest(key.apiKey, 'md5')

  const user = await db('apiKeys')
    .where({ user_id: id })
    .first()

  // bcrypt.hash(key.apiKey, 10, async (_err, hash) => {
  if (user) {
    try {
      await db('apiKeys')
        .where({ user_id: id })
        .update({ key: db.raw("digest(?, 'md5')", [key.apiKey]) })

      res.status(200).json({ existed: true, key: key.apiKey })
    } catch (err) {
      console.log(err)
    }
  } else {
    try {
      await db('apiKeys')
        .raw()

        .insert({
          key: db.raw("digest(?, 'md5')", [key.apiKey]),
          user_id: id
        })

      res.status(200).json({ existed: false, key: key.apiKey })
    } catch (err) {
      console.log(err)
    }
  }
  // })
})

module.exports = router
