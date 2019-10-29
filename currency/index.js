const axios = require('axios')

const defaultRates = {
  // Fallback in case currency API goes down. Instead of being a static object, we can ultimately cache most recent successful call in redis and pull it from there
  MWK: {
    rate: 732
  },
  RWF: {
    rate: 920
  },
  KES: {
    rate: 103.5
  },
  UGX: {
    rate: 3709.09
  },
  TZS: {
    rate: 2302.91
  },
  CDF: {
    rate: 1666
  },
  BIF: {
    rate: 1870
  },
  USD: {
    rate: 1
  },
  updated: 'Tue, 29 Oct 2019 13:51:22 GMT'
}

const getExchangeRates = async () => {
  return await axios
    .get(
      'http://sautiafrica.org/endpoints/api.php?url=v1/exchangeRates/&type=json'
    )
    .then(res => {
      res.data.updated = new Date().toUTCString()
      return res.data
    })
    .catch(error => {
      return defaultRates
    })
}

const convertCurrency = (source, target, value, exchangeRates) => {
  if (source !== target && exchangeRates[source].rate !== 0) {
    return (value / exchangeRates[source].rate) * exchangeRates[target].rate
  } else return value
}

module.exports = async (data, targetCurrency) => {
  return await getExchangeRates()
    .then(rates => {
      return data.map(row => {
        row.wholesale = convertCurrency(
          row.currency,
          targetCurrency,
          row.wholesale,
          rates
        )
        row.retail = convertCurrency(
          row.currency,
          targetCurrency,
          row.wholesale,
          rates
        )
        row.currency = targetCurrency
        return row
      })
    })
    .catch(error => {
      return 'Currency conversion error'
    })
}
