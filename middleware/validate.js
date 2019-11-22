//We have created several custom middleware to detect correct keys when req.query is passed
//Below are many functions which can assist req.query to handle errors better

module.exports = {
  queryProduct,
  queryProductMarket,
  queryProductDate,
  queryCountPage,
  queryCurrency,
  playgroundDR
}
//Detecting whether key of req.query object has 'product' and is not empty
function queryProduct(req, res, next) {
  if (req.query.product === undefined) {
    res.status(400).json({
      message: "Please supply the query parameter of 'product' "
    })
  } else {
    next()
  }
}

//default and limit for dynamic results per page limit for developer pagination.
//default is 30 results per page returned and max is 500 per page.
function queryCountPage(req, res, next) {
  if (req.query.count > 500) {
    req.message = 'Each page can have maximum of 500 records'
    req.query.count = 500
    next()
  } else if (!req.query.count) {
    req.message = 'Default count is 30 per page'
    req.query.count = 30
    next()
  } else {
    next()
  }
}
//middleware for product in particular market //
function queryProductMarket(req, res, next) {
  if (req.query.product === undefined) {
    res.status(400).json({
      message: "Please supply the query parameter of 'product' "
    })
  } else if (req.query.market === undefined) {
    res
      .status(400)
      .json({ message: "Please supply the query parameter of 'market' " })
  } else {
    next()
  }
}
//middleware for playground date range endpoint//
function playgroundDR(req, res, next) {
  if (!req.query.hasOwnProperty('product')) {
    res.status(400).json({ message: 'please supply product' })
  } else if (!req.query.hasOwnProperty('startDate')) {
    res.status(400).json({ message: 'please supply startDate=YYYY-MM-DD' })
  } else if (!req.query.hasOwnProperty('endDate')) {
    res.status(400).json({ message: 'please supply endDate=YYYY-MM-DD' })
  } else {
    next()
  }
}
//middleware for product via date range
function queryProductDate(req, res, next) {
  if (req.query.product === undefined) {
    res.status(400).json({
      message: "Please supply the query parameter of 'product' "
    })
  } else if (req.query.startDate === undefined) {
    res.status(400).json({
      message: "Please supply the query parameter of 'startDate' "
    })
  } else if (req.query.endDate === undefined) {
    res
      .status(400)
      .json({ message: "Please supply the query parameter of 'endDate' " })
  } else {
    next()
  }
}

//Detects the type of currency requested to be converted
function queryCurrency(req, res, next) {
  const supportedCurrencies = [
    'MWK',
    'RWF',
    'KES',
    'UGX',
    'TZS',
    'CDF',
    'BIF',
    'USD'
  ]
  const { currency } = req.query

  if (currency === undefined) {
    req.currency = 'USD' // Set USD as default for currency conversion if no 'currency' parameter supplied
    next()
  } else if (!supportedCurrencies.includes(currency.toUpperCase())) {
    res.status(400).json({
      message: `Parameter 'currency' must be one of:  ${supportedCurrencies}`
    })
  } else {
    req.currency = currency.toUpperCase()
    next()
  }
}
