module.exports = (req, res, next) => {
  const { key } = req.header

  key
    ? next()
    : res.status(403).json({
        error: "Valid key not provided. Access denied"
      })
}
