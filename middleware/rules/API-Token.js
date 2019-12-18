// * API TOKEN FOR MANAGEMENT API
const request = require("request");

// * json Object as a value for the body property needed in "options"
// * for REQUESTING token to use management API (https://auth0.com/docs/api/management/v2)
const json = JSON.stringify({
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    audience: "https://sauti-africa-market-prices.auth0.com/api/v2/",
    grant_type: "client_credentials"
})

const options = {
    method: 'POST',
    url: 'https://sauti-africa-market-prices.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: json
};

module.exports = () => request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // ! API CONSOLE LOG DATA CALLS
    // console.log('BODY', body);
    // console.log('RESPONSE', response);
});