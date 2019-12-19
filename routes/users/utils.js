// * RETRIEVE FULL USER SCHEMA / DATA FROM AUTH0
const fetchUserSchema = async (req, res) => {
    const request = require('request-promise');
    let fetchedData;

    const json = JSON.stringify({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        audience: 'https://sauti-africa-market-prices.auth0.com/api/v2/',
        grant_type: 'client_credentials'
    })

    const options = {
        method: 'POST',
        url: 'https://sauti-africa-market-prices.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: json
    }

    // * SET TOKEN FOR AUTHORIZED API USAGE
    await request(options)
        .then(result => !!result === true && JSON.parse(result).access_token)
        .then(result => {
            const managementAPI = {
                method: 'GET',
                url: `https://sauti-africa-market-prices.auth0.com/api/v2/users/${req.body.sub}`,
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${result}`
                }
            }

            return request(managementAPI)
                .then(result => fetchedData = { ...fetchedData, ...JSON.parse(result) })
                .then(result => res.status(200).json(fetchedData))
        })
}

module.exports = {
    fetchUserSchema
}