/* this middleware looks up the role based on the userId or api key, and sets the allowedStart to 7 days from the current day for free users, and 2 years from the current day for paid users. 

1) calculate:

1 day = 86,400,000 ms
7 days = 604,800,000 ms
730 days = 63,072,000,000 ms

const freePeriod = 604800000
const paidPeriod = 63072000000

const todayDate = new Date();
const todayMS = todayDate.getTime();
const startDate = todayMS - freePeriod || paidPeriod

2) convert the calculated difference back to calendar date to set allowableStart
const allowedStart = new Date(startDate)

3) assign to request key
req.allowedStart = allowedStart

*/

//import database access
const db = require('../api-key/dbConfig')

module.exports = async (req,res,next) => {







}