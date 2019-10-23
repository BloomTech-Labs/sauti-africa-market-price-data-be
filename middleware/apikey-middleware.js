const db = require('../api-key/dbConfig')

module.exports = async (req, res, next) => {
  const { key } = req.headers

  let validKey = null

  /*=== checks validity of key ===*/
  if (key) {
    try {
      validKey = await db('apiKeys')
        .where({ key })
        .first()
    } catch (error) {
      console.log(error)
    }
  }

  /*=== sends key on req object to apiLim middleware ===*/
  if (validKey) {
    req.key = validKey
    next()
  } else {
    res.status(403).json({
      error: 'Valid key not provided. Access denied'
    })
  }
}
