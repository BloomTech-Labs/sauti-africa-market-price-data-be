

module.exports = async (data, allowedPeriod ) =>{

    //create date from most recent record in returned data
    const recentDate = new Date(data.recentRecordDate)
    
    //convert that date to milliseconds
    const recentMS = recentDate.getTime()
    

    //calculate earliest allowable date. (recentMS - 7days) for free users or (recentMS - 730 days) for paid users.
    const recordStartMS = (recentMS - allowedPeriod)
    

    let filteredResults = await data.data.filter(record => {
        const recordDate = new Date(record.date)
        const recordDateMS = recordDate.getTime()

        return (recordDateMS > recordStartMS)
    })

    console.log(`filteredResults `,filteredResults)

    return {
         warning:data.warning,
         records: filteredResults,
         ratesUpdated:data.ratesUpdated,
         next:data.next,
         prev:data.prev,
         count:data.count
    }
}
