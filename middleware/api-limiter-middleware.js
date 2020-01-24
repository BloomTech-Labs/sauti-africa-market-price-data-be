const { promisify } = require('util')
const client = require('../redis')
//import apikey config for read/write/update of reset_date in api_keys table
const db = require('../api-key/dbConfig')


client.get = promisify(client.get)

const CALL_LIMIT = 10000 // change as needed
// const CALL_LIMIT = 3 // test

module.exports = async (req, res, next) => {
  //get api key and role and user_id from req/req headers
  const { key } = req;
  const { role } = req;
  const { userId } = req;

  if (role === 'freeUser') {

    //retrieve reset_start_date from api-key table
      const resetStart = await db('apiKeys')
      .select('reset_date')
      .where({user_id:userId});

    //generate todays date in milliseconds
      const currentDate = new Date();
      const currentDateMS = currentDate.getTime();

    //calculate the elapsed days
      const elapsedDays = Number(currentDateMS) - Number(resetStart[0].reset_date);
      const currentPeriod = elapsedDays/(1000*3600*24);
      const remainingDays = 30 - currentPeriod;


    // test if the period exceeds 30 days. If so, reset the count in redis, update the reset_date to the current date in milliseconds 

      if (currentPeriod > 30){
        await client.set(userId, 1);

        await db('apiKeys')
        .where({user_id:userId})
        .update({reset_date:currentDateMS})
      }

      // Retrieve key usage by userId from redis cache
      const calls = await client.get(userId) 


      //enforce quotas
      if (calls) {
        if (calls < CALL_LIMIT) {

          //increment calls
          const newCalls = Number(calls) + 1
          
          // Update # of calls in redis cache
          client.set(userId, newCalls) 

          const count = await client.get(userId)

          await db('apiKeys')
          .where({user_id:userId})
          .update({apikey_count:count})

          // Update # of calls in redis cache
          client.set(userId, newCalls) 


          // Send updated call count to FE in response body. 
          let currentCount = await client.get(userId)
         
          //pass count 
          req.count = currentCount;
          next()
        } else
          // return status notifying user they have exceeded count and days before reset. 

          res.status(403).json({
            message: `Key: ${key} has exceeded the call limit of ${CALL_LIMIT} calls. Call limit will reset in ${remainingDays} days.`

          })
      } else {
        // Create a new key in redis cache
        client.set(userId, 1)

        let currentCount = await client.get(userId)
        
        //pass count 
        req.count = currentCount;
        
        next()
      }
  } else {
    
    req.count = 0
    
    next()
  }
};
