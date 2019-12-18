
const { promisify } = require('util')

const client = require('../redis')

client.get = promisify(client.get)

const CALL_LIMIT = 10000 // change as needed

module.exports = async (req, res, next) => {



  const { key } = req
  const role = 'freeUser'; //testing, remove this

  if (role === 'freeUser') {
    const calls = await client.get(key) // Retrieve key usage from redis cache

    if (calls) {
      if (calls < CALL_LIMIT) {
        const newCalls = Number(calls) + 1
    
        client.set(key, newCalls) // Update # of calls in redis cache
        console.log(await client.get(key)) //delete this after testing
        next()
      } else
        res.status(403).json({
          message: `Key: ${key} has exceeded the call limit of ${CALL_LIMIT} calls`
        })
    } else {
      client.set(key, 0) // Create a new key in redis cache
      next()
    }
  }
  else {
    next()
  }
}

