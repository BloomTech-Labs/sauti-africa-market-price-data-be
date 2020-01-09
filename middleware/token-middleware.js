const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

module.exports = async (req, res, next) => {
  jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri:
        'https://sauti-africa-market-prices.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://sauti-africa-market-prices.auth0.com/api/v2/',
    issuer: 'https://sauti-africa-market-prices.auth0.com/',
    algorithms: ['RS256']
  })
  next();
}
