require('dotenv').config()
const redis = require('redis')
// const cron = require('node-cron')

const redis_url = process.env.REDIS_URL || 6379

const client = redis.createClient(redis_url)

client.on('error', err => {
  console.log('error', err)
})

/*=== every minute (* * * * *), keys are reset ===*/
/*=== every day at midnight (0 0 * * *), keys are reset ===*/
/*=== NOTE: For heroku, this won't work with free tier, look into Heroku scheduler ===*/
// cron.schedule('* * * * *', () => {
//   client.FLUSHALL()
//   console.log(`\n=== flushed 🚽 ===\n`)
// })

module.exports = client
