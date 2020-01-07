const db = require('../api-key/dbConfig')
const bcrypt = require('bcryptjs')

module.exports = async (req, res, next) => {
  const { key } = req.headers

  let validKey = null
  let userId = null
  let hashedKey
  const keyCandidates = await db('apiKeys')

  /*=== checks validity of key ===*/
  if (key) {
    try {
      // Experimental Postgres key validation. Not currently implemented
      // validKey = await db('apiKeys')
      //   .where({ key: db.raw("digest(?, 'md5')", [key]) })
      //   .first()
      for (candidate of keyCandidates) {
        const k = await bcrypt.compare(key, candidate.key)

        if (k) {
          //set hashedKey for user_id lookup
          hashedKey = candidate.key
          
          //db lookup the user_id based on the key
          userId = await db('apiKeys')
          .select('user_id')
          .where({key:hashedKey}) 
          console.log(`userID:`,userId[0].user_id)
          validKey = key
            break
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  /*=== sends key on req object to apiLim middleware ===*/
  if (validKey) {
    req.key = validKey
    req.userId = userId[0].user_id
    next()
  } else {
    res.status(403).json({
      error: 'Valid key not provided. Access denied.'
    })
  }
}
