const db = require('../api-key/dbConfig')
const bcrypt = require('bcryptjs')

module.exports = async (req, res, next) => {
  const { key } = req.headers
  let validKey = null

  /*=== checks validity of key ===*/
  if (key) {
    const users = await db('apiKeys')

    for (let i = 0; i < users.length; i++) {
      bcrypt.compare(key, users[i].key, function(err, res) {
        if (res === true) {
          req.key = key
          next()
        }
      })
    }
  } else {
    res
      .status(403)
      .json({ error: 'Valid key not provided. Access denied', key: key })
  }
}
