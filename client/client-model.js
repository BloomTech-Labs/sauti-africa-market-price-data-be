const DBSt = require('../database/dbSTConfig')

module.exports = {
  getSautiDataClient,
  getListsOfThings
}

// Helper function with filter searches for client side
// Flexible by allowing user to select whichever query they want.

function getSautiDataClient(query) {
  let queryOperation = DBSt('platform_market_prices2')
  let { count, page, startDate, endDate } = query;
  console.log(startDate, endDate);

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

  queryOperation = queryOperation
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
  .where('active', (query.a = 1));

  if (startDate && endDate) {
    queryOperation = queryOperation.andWhereBetween('date', [startDate, endDate])
  }
  queryOperation = queryOperation.limit(count).offset(page);

  return queryOperation;
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
function dateRange() {
  return DBSt('platform_market_prices2')
    .select('*')
    .where('product', product)
    .andWhereBetween('date', [startDate, endDate])
    .limit(count)
    .offset(page)
}

//   let queryOperation = DBSt('platform_market_prices2')
//   const { sortby = 'udate', sortdir = 'desc', limit = 50 } = query

//   // If user wants data from specific country/countries
//   if (query.c && !Array.isArray(query.c)) {
//     queryOperation = queryOperation.whereIn('country', [query.c])
//   } else if (query.c && Array.isArray(query.c)) {
//     queryOperation = queryOperation.whereIn('country', query.c)
//   }

//   //if user wants data from specific markets
//   if (query.market && !Array.isArray(query.market)) {
//     queryOperation = queryOperation.whereIn('market', [query.market])
//   } else if (query.market && Array.isArray(query.market)) {
//     queryOperation = queryOperation.whereIn('market', query.market)
//   }

//   //if user wants data from specific product catgories
//   if (query.pcat && !Array.isArray(query.pcat)) {
//     //pcat = product category (product_cat) -> General
//     queryOperation = queryOperation.whereIn('product_cat', [query.pcat])
//   } else if (query.pcat && Array.isArray(query.pcat)) {
//     queryOperation = queryOperation.whereIn('product_cat', query.pcat)
//   }

//   //if user wants data from specific subcategories
//   if (query.pagg && !Array.isArray(query.pagg)) {
//     //pagg = product_agg -> product type
//     queryOperation = queryOperation.whereIn('product_agg', [query.pagg])
//   } else if (query.pagg && Array.isArray(query.pagg)) {
//     queryOperation = queryOperation.whereIn('product_agg', query.pagg)
//   }

//   //if user wants data of specific products
//   if (query.p && !Array.isArray(query.p)) {
//     //p = product -> Specific product
//     queryOperation = queryOperation.whereIn('product', [query.p])
//   } else if (query.p && Array.isArray(query.p)) {
//     queryOperation = queryOperation.whereIn('product', query.p)
//   }

//   return queryOperation
//     .orderBy(sortby, sortdir)
//     .where('active', (query.a = 1))
//     .limit(limit)
// }
