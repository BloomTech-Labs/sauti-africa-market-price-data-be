const DBSt = require('../database/dbSTConfig')

module.exports = {
  getSautiData,
  latestPriceByMarket,
  latestPriceAcrossAllMarkets,
  getAllRecords,
  getProductPriceRange,
  getListsOfThings
}

// Helper function with filter searches for developer
// Notes: Flexible by allowing user to select whichever query they want.

function getSautiData(query) {
  let queryOperation = DBSt('platform_market_prices2')
  let { count, page } = query

  if (count) {
    count = parseInt(count)
  } else {
    count = 20
  }
  if (page) {
    page = (parseInt(page) - 1) * count
  } else {
    page = 0
  }

  // If user wants data from specific country/countries
  if (query.c && !Array.isArray(query.c)) {
    queryOperation = queryOperation.whereIn('country', [query.c])
  } else if (query.c && Array.isArray(query.c)) {
    queryOperation = queryOperation.whereIn('country', query.c)
  }

  // If user wants data from specific markets
  if (query.market && !Array.isArray(query.market)) {
    queryOperation = queryOperation.whereIn('market', [query.market])
  } else if (query.market && Array.isArray(query.market)) {
    queryOperation = queryOperation.whereIn('market', query.market)
  }

  //if user wants data from spcific product categories
  if (query.pcat && !Array.isArray(query.pcat)) {
    //pcat = product category (product_cat) -> General
    queryOperation = queryOperation.whereIn('product_cat', [query.pcat])
  } else if (query.pcat && Array.isArray(query.pcat)) {
    queryOperation = queryOperation.whereIn('product_cat', query.pcat)
  }

  //if user wnats data from product subcategory
  if (query.pagg && !Array.isArray(query.pagg)) {
    //pagg = product_agg -> product type
    queryOperation = queryOperation.whereIn('product_agg', [query.pagg])
  } else if (query.pagg && Array.isArray(query.pagg)) {
    queryOperation = queryOperation.whereIn('product_agg', query.pagg)
  }

  //if user wants data of specific products
  if (query.p && !Array.isArray(query.p)) {
    //p = product -> Specific product
    queryOperation = queryOperation.whereIn('product', [query.p])
  } else if (query.p && Array.isArray(query.p)) {
    queryOperation = queryOperation.whereIn('product', query.p)
  }

  return queryOperation
    .select(
      'country',
      'market',
      'source',
      'product_cat',
      'product_agg',
      'product',
      'retail',
      'wholesale',
      'currency',
      'unit',
      'date',
      'udate'
    )
    .orderBy('date', 'desc')
    .where('active', (query.a = 1))
    .limit(count)
    .offset(page)
}

function latestPriceAcrossAllMarkets(query) {
  const { product } = query
  return DBSt.schema.raw(
    `SELECT pmp.source, pmp.market, pmp.product, pmp.retail, pmp.wholesale, pmp.currency, pmp.date, pmp.udate FROM platform_market_prices2 AS pmp INNER JOIN
    (
        SELECT max(date) as maxDate, market, product, retail, currency, wholesale, source, udate 
       FROM platform_market_prices2
       WHERE product=?
       GROUP BY market
   ) p2 
   ON pmp.market = p2.market
    AND pmp.date = p2.maxDate
     WHERE pmp.product=?
     order by pmp.date desc`,
    [product, product]
  )
}

function latestPriceByMarket(query) {
  const { product, market } = query
  let queryOperation = DBSt('platform_market_prices2')
  return queryOperation
    .select(
      'market',
      'source',
      'country',
      'currency',
      'product',
      'retail',
      'wholesale',
      'date',
      'udate'
    )
    .where('product', `${product}`)
    .andWhere('market', `${market}`)
    .orderBy('date', 'desc')
    .first()
}

function getListsOfThings(query, selector) {
  let queryOperation = DBSt('platform_market_prices2')
  if (query === undefined) {
    query = 'market'
  }
  switch (query.toLowerCase()) {
    case 'market':
      return queryOperation.distinct('market').orderBy('market')
    case 'country':
      return queryOperation.distinct('country').orderBy('country')
    case 'source':
      return queryOperation.distinct('source').orderBy('source')
    case 'product':
      return queryOperation.distinct('product').orderBy('product')
    default:
      return queryOperation.distinct('market').orderBy('market')
  }
}

function getAllRecords(count, page) {
  if (count) {
    count = parseInt(count)
  } else {
    count = 20
  }
  if (page) {
    page = (parseInt(page) - 1) * count
  } else {
    page = 0
  }

  return DBSt('platform_market_prices2')
    .select('*')
    .limit(count)
    .offset(page)
}

function getProductPriceRange(product, startDate, endDate, count, page) {
  if (count) {
    count = parseInt(count)
  } else {
    count = 20
  }
  if (page) {
    page = (parseInt(page) - 1) * count
  } else {
    page = 0
  }

  return DBSt('platform_market_prices2')
    .select('*')
    .where('product', product)
    .andWhereBetween('date', [startDate, endDate])
    .limit(count)
    .offset(page)
}

// function kathrynAttempt(query){
//   const {list} = query
//   return DBSt("platform_market_prices2").distinct(list).orderBy(list)
// }

// function getProducts() {
//   return DBSt("platform_market_prices2")
//     .distinct("product")
//     .orderBy("product")
// }

// function getMarkets() {
//   return DBSt("platform_market_prices2")
//     .distinct("market")
//     .orderBy("market")
// }

// function getCountries() {
//   return DBSt("platform_market_prices2")
//     .distinct("country")
//     .orderBy("country")
// }

// function getSources() {
//   return DBSt("platform_market_prices2")
//     .distinct("source")
//     .orderBy("source")
// }
