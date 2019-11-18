const DBSt = require('../database/dbSTConfig')

module.exports = {
  getSautiDataClient,
  getListsOfThings,
  mcpList,
  getPlay,
  getProductPriceRangePlay,
  getPMPlay
}

// Grid table functions

// Helper function with filter searches for client side
// Flexible by allowing user to select whichever query they want.

async function getSautiDataClient(query, csvLimit) {
  let { startDate, endDate } = query

  let entries
  let totalCount

  if (query.next) {
    const cursorArray = query.next.split('_')
    const nextDate = new Date(cursorArray[0])
    const nextId = cursorArray[1]
    let queryOperation = DBSt('platform_market_prices2')

    // If user wants data from specific country/countries
    if (query.c && !Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn('country', [query.c])
    } else if (query.c && Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn('country', query.c)
    }

    // If user wants data from specific markets
    if (query.m && !Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn('market', [query.m])
    } else if (query.m && Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn('market', query.m)
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

    queryOperation = queryOperation.select(
      'id',
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

    if (startDate && endDate) {
      queryOperation = queryOperation.andWhereBetween('date', [
        startDate,
        endDate
      ])
    }

    entries = await queryOperation
      .where(function() {
        this.whereRaw('date < ?', [nextDate]).orWhere(function() {
          this.whereRaw('date = ?', [nextDate]).andWhereRaw('id <= ?', [nextId])
        })
        // .andWhereRaw("id <= ?", [nextId]);
      })


      .where('active', (query.a = 1))
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .limit(csvLimit || 31)

  } else {
    // If user wants data from specific country/countries
    let queryOperation = DBSt('platform_market_prices2')
    if (query.c && !Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn('country', [query.c])
    } else if (query.c && Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn('country', query.c)
    }

    // If user wants data from specific markets
    if (query.m && !Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn('market', [query.m])
    } else if (query.m && Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn('market', query.m)
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

    queryOperation = queryOperation.select(
      'id',
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

    if (startDate && endDate) {
      queryOperation = queryOperation.andWhereBetween('date', [
        startDate,
        endDate
      ])
    }
    totalCount = await queryOperation.clone().count()
    entries = await queryOperation

      .where('active', (query.a = 1))
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .limit(csvLimit || 31)

  }

  const lastEntry = entries[entries.length - 1]

  entries.length ? (next = `${lastEntry.date}_${lastEntry.id}`) : (next = null)
  const entriesOffset = entries.splice(0, csvLimit || 30)

  const firstEntry = entriesOffset[0]
  entriesOffset.length
    ? (prev = `${firstEntry.date}_${firstEntry.id}`)
    : (prev = null)

  return {
    records: entriesOffset,
    next: next,
    prev: prev,
    count: totalCount
  }
}
function marketList() {
  return DBSt('platform_market_prices2')
    .distinct('market')
    .orderBy('market')
}
function countryList() {
  return DBSt('platform_market_prices2')
    .distinct('country')
    .orderBy('country')
}
function productList() {
  return DBSt('platform_market_prices2')
    .distinct('product')
    .orderBy('product')
}
function pcatList() {
  return DBSt('platform_market_prices2')
    .distinct('product_cat')
    .orderBy('product_cat')
}
function paggList() {
  return DBSt('platform_market_prices2')
    .distinct('product_agg')
    .orderBy('product_agg')
}
function mcpList() {
  const marketQuery = marketList()
  const countryQuery = countryList()
  const productQuery = productList()
  const pcatQuery = pcatList()
  const paggQuery = paggList()
  return Promise.all([
    marketQuery,
    countryQuery,
    productQuery,
    pcatQuery,
    paggQuery
  ]).then(([markets, country, product, category, aggregator]) => {
    let total = {}
    total.countries = country
    total.products = product
    total.markets = markets
    total.categories = category
    total.aggregators = aggregator
    return total
  })
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
    case 'category':
      return queryOperation.distinct('product_cat').orderBy('product_cat')
    case 'aggregator':
      return queryOperation.distinct('product_agg').orderBy('product_agg')
    default:
      return queryOperation.distinct('market').orderBy('market')
  }
}
// End of Grid table functions

// Playground functions
//filter playground function//
function getPlay(query) {
  let queryOperation = DBSt('platform_market_prices2')

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
    .limit(1)
}


function getProductPriceRangePlay({ product, startDate, endDate }) {

  return DBSt('platform_market_prices2')
    .select('*')
    .where('product', product)
    .andWhereBetween('date', [startDate, endDate])
    .limit(1)
}

function getPMPlay(query) {
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
    .limit(1)
}

// End of Playground functions