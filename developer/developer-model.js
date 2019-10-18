const DBSt = require('../database/dbSTConfig');

module.exports = {
    getSautiData,
    latestPrice,
    latestPriceByMarket,
    getProducts,
    getCountries,
    getMarkets
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

    if (query.market && !Array.isArray(query.market)) {
        queryOperation = queryOperation.whereIn('market', [query.market]);
    } else if (query.market && Array.isArray(query.market)){
        queryOperation = queryOperation.whereIn('market', query.market);
    }
    
    if (query.pcat && !Array.isArray(query.pcat)) {
        //pcat = product category (product_cat) -> General
        queryOperation = queryOperation.whereIn('product_cat', [query.pcat]);
    } else if (query.pcat && Array.isArray(query.pcat)){
        queryOperation = queryOperation.whereIn('product_cat', query.pcat);
    }
    
    if (query.pagg && !Array.isArray(query.pagg)) {
        //pagg = product_agg -> product type
        queryOperation = queryOperation.whereIn('product_agg', [query.pagg]);
    } else if (query.pagg && Array.isArray(query.pagg)){
        queryOperation = queryOperation.whereIn('product_agg', query.pagg);
    }
    
    if (query.p && !Array.isArray(query.p)) {
        //p = product -> Specific product
        queryOperation = queryOperation.whereIn('product', [query.p]);
    } else if (query.p && Array.isArray(query.p)){
        queryOperation = queryOperation.whereIn('product', query.p);
    }

    return queryOperation
        .orderBy(sortby, sortdir)
        .where('active', query.a=1)
        .limit(limit);
}


function latestPrice(query){

    const { product } = query
    let queryOperation = DBSt('platform_market_prices');
    return queryOperation
        .select('market', 'country','currency', 'product', 'retail', 'wholesale', 'udate')
        .where('product', `${product}`)
        .groupBy('market')
        .orderBy('udate', 'desc')
        .limit(500);
        
        // knex.raw('SELECT' pmp.market, pmp.product, pmp.retail, pmp.wholesale, pmp.udate 
        // FROM platform_market_prices as pmp INNER JOIN (SELECT max(udate) as maxDate, market
        // FROM platform_market_prices
        // WHERE product='yellow beans'
        // GROUP BY market ) 
        // p2 ON pmp.market = p2.market AND pmp.udate = p2.maxDate WHERE pmp.product=`${product}` 
        // order by pmp.udate desc)
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