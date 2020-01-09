const express = require('express')
const router = express.Router()
const uuidAPIKey = require('uuid-apikey')
const bcrypt = require('bcryptjs')

const db = require('../api-key/dbConfig')

const jwtCheck = require('../middleware/token-middleware')

router.post('/private', jwtCheck, async (req, res) => {
  const key = uuidAPIKey.create()
  const { id } = req.body;

  //generate new date to be written to table
  const date = new Date();
  //get the exact date in milliseconds
  const dateMilliseconds = date.getTime();

  const user = await db('apiKeys')
    .where({ user_id: id })
    .first()

  bcrypt.hash(key.apiKey, 10, async (_err, hash) => {
    if (user) {
      try {
        await db('apiKeys')
          .where({ user_id: id })
          //update table with key hash. Don't reset reset_date.
          .update({ key: hash})
        res.status(200).json({ existed: true, key: key.apiKey })
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        await db('apiKeys').insert({ 
          key: hash, 
          user_id: id, 
          reset_date:dateMilliseconds
        })
        res.status(200).json({ existed: false, key: key.apiKey })
      } catch (err) {
        console.log(err)
      }
    }
  })
})

module.exports = router
