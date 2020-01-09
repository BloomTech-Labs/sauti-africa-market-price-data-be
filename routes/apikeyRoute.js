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
  //get the exact date (as a number, ie if date is 12/01/2019, getDate() returns 01)
  const dateMilliseconds = date.getTime();

  const user = await db('apiKeys')
    .where({ user_id: id })
    .first()

/* 
TODO: MATT -- Disallow generation of unlimited API keys 
  1) Keys are stored in hashed form, which cannot be unhashed. 
  2) Alternate method: 
    * Get the users email using Bao's auth0 middleware, send post request with auth0|user_id to retrieve user object --> extract email
    * On API key generation, we will use sendmail or nodemailer to send the unhashed api key to the registered email of the user using the sautimarketprices@gmail.com account as smtp. Sauti can change this to an organization email at a later time, or future cohorts can implement sendgrid/mailchimp/alternate solution. 
    * Check the apikey table to see if user_id is present. 
    * if present, return response message saying that an API key exists
*/

  bcrypt.hash(key.apiKey, 10, async (_err, hash) => {
    if (user) {
      try {
        await db('apiKeys')
          .where({ user_id: id })
          .select()
          //update table with key hash and day
          .update({ key: hash, reset_date:dateMilliseconds})

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
