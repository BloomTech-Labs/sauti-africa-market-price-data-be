const { promisify } = require('util')
const client = require('../redis')
//import apikey config for read/write/update of reset_date in api_keys table
const db = require('../api-key/dbConfig')



client.get = promisify(client.get)

const CALL_LIMIT = 10000 // change as needed

module.exports = async (req, res, next) => {
  //get api key and role from req headers
  const { key } = req;
  const { role } = req.headers;
  const { userId } = req;
  // const role = 'freeUser'; //testing, remove this

  //retrieve user_id


  //retrieve reset_start_date from api-key table


  if (role === 'freeUser') {
    const calls = await client.get(key) // Retrieve key usage from redis cache

    if (calls) {
      if (calls < CALL_LIMIT) {
        const newCalls = Number(calls) + 1
    
        client.set(key, newCalls) // Update # of calls in redis cache
        // console.log(await client.get(key)) //delete this after testing
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


/*

* added date_generated column
* added logic to create a new date and write to
  table so that we can calculate quota reset in Apikeyroute

* algorithm for calculating dates: 
  1) get date generated (in milliseconds) from table
  2) get today's date in milliseconds
  3)  
    todays_date - date generated --> yeilds differential in milliseconds

    dateRange = differential/1000*60*60*24

    if dateRange > 30, reset count in redis

    if dateRange > 30, update reset_start date to today's date. 

*/