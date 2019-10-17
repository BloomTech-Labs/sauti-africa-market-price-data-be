const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const DBSt = require('../database/dbSTConfig');


const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('working in my test server');
});

// Helper function with filter searches
// Notes:

function getSautiData(query){

    let queryOperation = DBSt('platform_market_prices');
    const {sortby = "udate", sortdir = "desc", limit= 50} = query
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

server.get('/sauti', (req, res) => {
    getSautiData(req.query).then(records => {
        res.status(200).json(records)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send(error.message)
    })
})

module.exports = server;