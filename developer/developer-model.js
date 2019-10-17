const DBSt = require('../database/dbSTConfig');

module.exports = {
    getSautiData,
    latestPrice,
    latestPriceByMarket
};

// Helper function with filter searches for developer
// Notes: Flexible by allowing user to select whichever query they want.
// Don't need to have each individual point to make a request.

function getSautiData(query){

    let queryOperation = DBSt('platform_market_prices');
    const {sortby = "udate", sortdir = "desc", limit= query.limit || 50} = query

    if (query.c && !Array.isArray(query.c)) {
        queryOperation = queryOperation.whereIn('country', [query.c]);
        console.log(query.c);
    } else if (query.c && Array.isArray(query.c)){
        queryOperation = queryOperation.whereIn('country', query.c);
    }

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

function latestPrice (query){
    const { product } = query
    let queryOperation = DBSt('platform_market_prices');
    return queryOperation.select('market', 'country','currency', 'product', 'retail', 'wholesale', 'udate').distinct('market').where('product', `${product}`).groupBy('market').orderBy('udate', 'desc').limit(500)

}

function latestPriceByMarket(query){
    const { product, market } = query
    let queryOperation = DBSt('platform_market_prices');
    return queryOperation.select('market', 'country','currency', 'product', 'retail', 'wholesale', 'udate').where('product', `${product}`).andWhere('market', `${market}`).orderBy('udate', 'desc').limit(500).first()
}