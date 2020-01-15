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

4) next()

implications for developer-model and client-model: 

*in each model, for endpoints that allow specifying whereInBetween with start/end dates, the provided dates must be compared against allowed date. If specified date exceeds allowed, then the start date must be overwritten with the allowedStart. 

use case: a freeUser only wants data returned for 2 calendar days that fall within their 7 day limit. negative case: a freeUser wants return data for a period before their allowedStart (not permitted)

user case: a paid user wants data returned from a specific period within their allowed period. Example: allowedStart is 01/14/2018, but user requests 12/01/2019-12/31/2019 (permitted), or negative case, allowedStart is 01/14/2018, but user requests data from 01/01/2013 (not permitted).

*This only needs to be done for routes that return records. Routes that return lists of options/markets/products/etc should not be restricted by the allowedStart date. 

*/


module.exports = async (req,res,next) => {

//pull role from req
const { role } = req

console.log(`time period middleware`,role)  

//set values for todayDate, convert todayDate to MS, set values for freePeriod/paidPeriod in milliseconds
const todayDate = new Date()
const todayMS = todayDate.getTime()
const freePeriod = Number(604800000);
const paidPeriod = Number(63072000000)

next()

}





// if (role === 'freeUser'){
//     //calculate startDate
//     const startDate = (Number(todayMS) - Number(freePeriod));
//     //set allowedStart in req before passing to router
//     req.allowedStart = startDate;

//     //! if calendar dates are needed; if not, remove.
//     const calendarStart = new Date(startDate)
//     console.log(calendarStart);

// } else if (role === 'paidUser' || role === 'admin'){

//     //calculate startDate
//     const startDate = (Number(todayMS) - Number(paidPeriod));
//     //set allowedStart in req
//     req.allowedStart = startDate;

//     //! depending on how dates are handled in db/model, may need to convert startDate in MS to calendar date
//     //Converts start date from MS to calendar date
//     const calendarStart = new Date(startDate)
//     console.log(calendarStart);
    
    
// }
// next()