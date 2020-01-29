const DBSt = require('../database/dbSTConfig')

module.exports = {
  getSautiData,
  latestPriceByMarket,
  latestPriceAcrossAllMarkets,
  getProductPriceRange,
  getListsOfThings
}

// Helper function with filter searches for developer
// Notes:
// Flexible by allowing user to select whichever query they want
// Used whereIn in the if/else if statements so that the query can be turned into an array
// if/else if statements used for countries, markets, etc. for single selection and multiple selection

async function getSautiData(query,apiCount) {
  let { startDate, endDate, count } = query

  let entries
  let totalCount

  //cursor pagination in developer routes is identical to what's implemented in
  //client-model except that developer model allows for dynamic limit of results per page.
  //More extensive code comments are in client-model.js file.

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
      .limit(Number(count) + 1)
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
      .limit(Number(count) + 1)
  }

  const lastEntry = entries[entries.length - 1]

  entries.length ? (next = `${lastEntry.date}_${lastEntry.id}`) : (next = null)
  const entriesOffset = entries.splice(0, Number(count))

  const firstEntry = entriesOffset[0]
  entriesOffset.length
    ? (prev = `${firstEntry.date}_${firstEntry.id}`)
    : (prev = null)

  return {
    records: entriesOffset,
    recentRecordDate:firstEntry.date,
    next: next,
    prev: prev,
    count: totalCount
  }
}


// fn to get the latest price for a product across all markets //

async function latestPriceAcrossAllMarkets(query) {
  const { product } = query

  const records = await DBSt.schema.raw(
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
 
  return {
    records:records[0],
    recentRecordDate:records[0][0].date,
  }
}


// fn to get the latest price for a product by market //
async function latestPriceByMarket(query) {
  const { product, market } = query
  let queryOperation = DBSt('platform_market_prices2')
  const queryResult = await queryOperation
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
  
  const result = [queryResult[0]]


  return {
    records:result,
    recentRecordDate:result[0].date
  }
  
}




// fn that returns a list of items, markets by default //
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
// fn that returns records for a product via date range, with pagination //

async function getProductPriceRange(query) {
  let { product, startDate, endDate, count } = query

  let entries
  let totalCount

  if (query.next) {
    const cursorArray = query.next.split('_')
    const nextDate = new Date(cursorArray[0])
    const nextId = cursorArray[1]
    let queryOperation = DBSt('platform_market_prices2')
      .select('*')
      .where('product', product)
      .andWhereBetween('date', [startDate, endDate])

    entries = await queryOperation
      .where(function() {
        this.whereRaw('date < ?', [nextDate]).orWhere(function() {
          this.whereRaw('date = ?', [nextDate]).andWhereRaw('id <= ?', [nextId])
        })
      })
      .where('active', (query.a = 1))
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .limit(Number(count) + 1)
  } else {
    let queryOperation = DBSt('platform_market_prices2')
      .select('*')
      .where('product', product)
      .andWhereBetween('date', [startDate, endDate])

    totalCount = await queryOperation.clone().count()
    entries = await queryOperation
      .where('active', (query.a = 1))
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .limit(Number(count) + 1)
  }

  const lastEntry = entries[entries.length - 1]

  entries.length ? (next = `${lastEntry.date}_${lastEntry.id}`) : (next = null)
  const entriesOffset = entries.splice(0, Number(count))

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

