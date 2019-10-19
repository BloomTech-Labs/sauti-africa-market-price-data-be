const db = require("../api-key/dbConfig")

module.exports = async (req, res, next) => {
  const { key } = req.headers
  let validKey = null

  if (key) {
    try {
      validKey = await db("apiKeys")
        .where({ key })
        .first()
    } catch (error) {
      console.log(error)
    }
  }

  validKey
    ? next()
    : res.status(403).json({
        error: "Valid key not provided. Access denied"
      })
}
