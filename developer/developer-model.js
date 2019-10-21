const DBSt = require('../database/dbSTConfig');

module.exports = {
    getSautiData,
    getProducts,
    getCountries,
    getMarkets,
    latestPriceByMarket,
    latestPriceAcrossAllMarkets,
    getAllRecords,
    getProductPriceRange
};

// Helper function with filter searches for developer
// Notes: Flexible by allowing user to select whichever query they want.

function getSautiData(query){

    let queryOperation = DBSt('platform_market_prices');
    const {sortby = "udate", sortdir = "desc", limit= query.limit || 50} = query
    
    // // If user wants data from specific country/countries
    // if (query.c) {
    //     let country = JSON.parse(query.c);
    //     queryOperation = queryOperation.whereIn('country', country);
    // }

    // //If user needs the market
    // if (query.market) {
    //     let market = JSON.parse(query.market);
    //     queryOperation = queryOperation.whereIn('market', market);
    // }

    // //If user needs a product category
    // if (query.pcat) {
    //     let pcat = JSON.parse(query.pcat);
    //     queryOperation.whereIn('product_cat', pcat);
    // }

    // //If user needs a subset of the product category
    // if (query.pagg) {
    //     let pagg = JSON.parse(query.pagg);
    //     queryOperation.whereIn('product_agg', pagg);

    // }

    // //If user needs a specific product
    // if (query.p) {
    //     let p = JSON.parse(query.p);
    //     queryOperation.whereIn('product', p);
    // }

    // If user wants data from specific country/countries
    if (query.c && !Array.isArray(query.c)) {
        queryOperation = queryOperation.whereIn('country', [query.c]);
    } else if (query.c && Array.isArray(query.c)){
        queryOperation = queryOperation.whereIn('country', query.c);
    }

    // If user wants data from specific markets
    if (query.market && !Array.isArray(query.market)) {
        queryOperation = queryOperation.whereIn('market', [query.market]);
    } else if (query.market && Array.isArray(query.market)){
        queryOperation = queryOperation.whereIn('market', query.market);
    }
    
    //if user wants data from spcific product categories
    if (query.pcat && !Array.isArray(query.pcat)) {
        //pcat = product category (product_cat) -> General
        queryOperation = queryOperation.whereIn('product_cat', [query.pcat]);
    } else if (query.pcat && Array.isArray(query.pcat)){
        queryOperation = queryOperation.whereIn('product_cat', query.pcat);
    }
    
    //if user wnats data from product subcategory
    if (query.pagg && !Array.isArray(query.pagg)) {
        //pagg = product_agg -> product type
        queryOperation = queryOperation.whereIn('product_agg', [query.pagg]);
    } else if (query.pagg && Array.isArray(query.pagg)){
        queryOperation = queryOperation.whereIn('product_agg', query.pagg);
    }

    //if user wants data of specific products
    if (query.p && !Array.isArray(query.p)) {
        //p = product -> Specific product
        queryOperation = queryOperation.whereIn('product', [query.p]);
    } else if (query.p && Array.isArray(query.p)){
        queryOperation = queryOperation.whereIn('product', query.p);
    }

    return queryOperation
        .select('country','market','product_cat','product_agg','product','retail','wholesale','currency','unit','udate')
        .orderBy(sortby, sortdir)
        .where('active', query.a=1)
        .limit(limit);
}

function latestPriceAcrossAllMarkets(query){
    const {product }= query
    return DBSt.schema.raw(`SELECT pmp.market, pmp.product, pmp.retail, pmp.wholesale, pmp.udate FROM platform_market_prices AS pmp INNER JOIN
    (
        SELECT max(udate) as maxDate, market, product, retail, wholesale 
       FROM platform_market_prices
       WHERE product=?
       GROUP BY market
   ) p2 
   ON pmp.market = p2.market
    AND pmp.udate = p2.maxDate
     WHERE pmp.product=?
     order by pmp.udate desc`,  [ product, product])   

}

function latestPriceByMarket(query){
    const { product, market } = query
    let queryOperation = DBSt('platform_market_prices');
    return queryOperation
        .select('market', 'country','currency', 'product', 'retail', 'wholesale', 'udate')
        .where('product', `${product}`).andWhere('market', `${market}`)
        .orderBy('udate', 'desc')
        .limit(500)
        .first()
}

function getProducts() {
    return DBSt('platform_market_prices')
        .distinct('product')
        .orderBy('product')
        .limit(500)
}

function getMarkets() {
    return DBSt('platform_market_prices')
        .distinct('market')
        .orderBy('market')
        .limit(500)
}

function getCountries() {
    return DBSt('platform_market_prices')
        .distinct('country')
        .orderBy('country')
        .limit(500)
}

function getAllRecords(count, page) {
    if (count) {
      count = parseInt(count);
    } else {
      count = 20;
    }
    if (page) {
      page = (parseInt(page) - 1) * count;
    } else {
      page = 0;
    }
  
    return DBSt("platform_market_prices")
      .select("*")
      .limit(count)
      .offset(page);
}
  
function getProductPriceRange(product, startDate, endDate) {
    return DBSt("platform_market_prices")
      .select("*")
      .where("product", product)
      .andWhereBetween("udate", [startDate, endDate]);
}