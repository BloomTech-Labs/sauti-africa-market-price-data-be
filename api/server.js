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

function getSautiData(query){

    let queryOperation = DBSt('platform_market_prices');
    if (query.c && !Array.isArray(query.c)) {
        queryOperation = queryOperation.where('country',query.c);
    } else {
        queryOperation = queryOperation.whereIn('country', query.c);
        console.log(query.c);
    }
    if (query.market) {
        queryOperation = queryOperation.whereIn('country','like', `%${query.market}%`);
        console.log(query.market);
    }
    if (query.product_agg) {
        queryOperation = queryOperation.where('product_agg', 'like', `%${query.product_agg}%`);
    }
    if (query.product) {
        queryOperation = queryOperation.where('product', 'like', `%${query.product}%`);
    }
    if(query.listc){
        queryOperation = queryOperation.select('country').count('product').groupBy('country')
    }
    queryOperation = queryOperation.orderBy('date').limit(query.limit || 500);
    return queryOperation;
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

// function getThings(query){

//     let queryOperation = DBSt('platform_market_prices');
//     if (query.country) {
//         queryOperation = queryOperation.where('country', query.country);
//     }
//     if (query.product_agg) {
//         queryOperation = queryOperation.where('product_agg', 'like', `%${query.product_agg}%`);
//     }
//     if (query.product) {
//         queryOperation = queryOperation.where('product', query.product);
//     }
//         queryOperation = queryOperation.orderBy('date').limit(query.limit || 10);
//         return queryOperation;
// }

// server.get('/sauti', (req, res) => {
//     getThings(req.query).then(records => {
//         res.status(200).json(records)
//     })
//     .catch(error => {
//         console.log(error)
//         res.status(500).send(error.message)
//     })
// })

module.exports = server;