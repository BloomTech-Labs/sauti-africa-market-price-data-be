const db = require('../api-key/dbConfig')
const bcrypt = require('bcryptjs')

module.exports = async (req, res, next) => {
  const { key } = req.headers

  let validKey = null

  const keyCandidates = await db('apiKeys')

  /*=== checks validity of key ===*/
  if (key) {
    try {
      // Experimental Postgres key validation. Not currently implemented
      // validKey = await db('apiKeys')
      //   .where({ key: db.raw("digest(?, 'md5')", [key]) })
      //   .first()
      for (candidate of keyCandidates) {
        // const k = await bcrypt.compare(key, candidate.key) //uncomment this line after local testing

        if (k) {
        // if (key === '12345'){  //remove this line and uncomment line 21
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
    next()
  } else {
    res.status(403).json({
      error: 'Valid key not provided. Access denied.'
    })
  }
}
