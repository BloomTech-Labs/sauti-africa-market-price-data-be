// const { promisify } = require('util')

// const client = require('../redis')

// client.get = promisify(client.get)

// const CALL_LIMIT = 100 // change as needed

// module.exports = async (req, res, next) => {
//   const { key } = req.key

//   const calls = await client.get(key)

//   if (calls) {
//     if (calls < CALL_LIMIT) {
//       const newCalls = Number(calls) + 1
//       client.set(key, newCalls)
//       next()
//     } else
//       res.status(403).json({
//         message: `Key: ${key} has exceeded the call limit of ${CALL_LIMIT} calls`
//       })
//   } else {
//     client.set(key, 0)
//     next()
//   }
// }
