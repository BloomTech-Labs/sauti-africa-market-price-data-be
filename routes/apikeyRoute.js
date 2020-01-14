const express = require('express')
const router = express.Router()
const uuidAPIKey = require('uuid-apikey')
const bcrypt = require('bcryptjs')
const db = require('../api-key/dbConfig')
const { fetchUserSchema } = require('../routes/users/utils')
const axios = require('axios')
const jwtCheck = require('../middleware/token-middleware')
const rules = require('../middleware/rules/rules-middleware');

router.post('/private', jwtCheck, rules, async (req, res) => {
  const key = uuidAPIKey.create()
  const { id } = req.body;
  let role

  req.body.sub = id;
  console.log(`req.body.sub`,req.body.sub)

  //generate new date to be written to table
  const date = new Date();
  //get the exact date in milliseconds
  const dateMilliseconds = date.getTime();

  const user = await db('apiKeys')
    .where({ user_id: id })
    .first()

  // const userAuth0 = await fetchUserSchema(req,res)
  // console.log(`userAuth0`,userAuth0);
  

  //hardcoded Bao's userId because roles are not currently being written due to redirect issue with Auth0. 
  let idObject = {
    "sub": "github|26471655"
    // "sub": `${id}`
  }

  

  axios.post('http://localhost:8888/api/users/', idObject)
  .then(response => {
    console.log(response.data.app_metadata.role)
    role = response.data.app_metadata.role;
    return role
  })
  .then(role => {
    console.log(`role`,role)
    return role
  })
  .then(role => {
    bcrypt.hash(key.apiKey, 10, async (_err, hash) => {
      if (user) {
        try {
          await db('apiKeys')
            .where({ user_id: id })
            //update table with key hash. Don't reset reset_date.
            .update({ key: hash, user_role: role})
          res.status(200).json({ existed: true, key: key.apiKey })
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          await db('apiKeys').insert({ 
            key: hash, 
            user_id: id, 
            reset_date:dateMilliseconds,
            user_role: role
          })
          res.status(200).json({ existed: false, key: key.apiKey })
        } catch (err) {
          console.log(err)
        }
      }
    })
  })
  .catch(err => {
    console.log(err)
  });
})

module.exports = router


/*
Notes: 

TODO: MATT -- Disallow generation of unlimited API keys 
  1) Keys are stored in hashed form, which cannot be unhashed. 
  2) Alternate method: 
    * Get the users email using Bao's auth0 middleware, send post request with auth0|user_id to retrieve user object --> extract email
    * On API key generation, we will use sendmail or nodemailer to send the unhashed api key to the registered email of the user using the sautimarketprices@gmail.com account as smtp. Sauti can change this to an organization email at a later time, or future cohorts can implement sendgrid/mailchimp/alternate solution. 
    * Check the apikey table to see if user_id is present. 
    * if present, return response message saying that an API key exists
    * change redis key:values from API key:count to auth0user_id:count
    * Allow users to generate knew key
    * Key is linked to user ID
    * Count is linked to user id
    * existing count and original reset time carry over to the new key
*/


  // await console.log(`role`,role)

  // bcrypt.hash(key.apiKey, 10, async (_err, hash) => {
  //   if (user) {
  //     try {
  //       await db('apiKeys')
  //         .where({ user_id: id })
  //         //update table with key hash. Don't reset reset_date.
  //         .update({ key: hash})
  //       res.status(200).json({ existed: true, key: key.apiKey })
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   } else {
  //     try {
  //       await db('apiKeys').insert({ 
  //         key: hash, 
  //         user_id: id, 
  //         reset_date:dateMilliseconds
  //       })
  //       res.status(200).json({ existed: false, key: key.apiKey })
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  // })