const db = require("../api-key/dbConfig")

module.exports = async (req, res, next) => {
  const { key } = req.header

  const validKey = await db("api-keys").where({ key })

  validKey
    ? next()
    : res.status(403).json({
        error: "Valid key not provided. Access denied"
      })
}
