require('dotenv').config()
const redis = require('redis')
// const cron = require('node-cron')

const redis_url = process.env.REDIS_URL || 6379

const client = redis.createClient(redis_url)

client.on('error', err => {
  console.log('error', err)
})


module.exports = client
