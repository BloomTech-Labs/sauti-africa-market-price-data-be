import Bottleneck from "bottleneck";
const axios = require('axios');

const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 100
});

async function getSautiDataClient(data){
    const axiosConfig = {
        url: '',
        method: 'get',
        data
    }
    return axios(axiosConfig)
}

const throttledGetSautiDataClient = limiter.wrap(getSautiDataClient);
async function getAllResults() {
    const sourceIds = []
    const count = 1000000;
    for(let i = 0; i < count; i++) {
        
    }
}

limiter.schedule(() => myFunction(arg1, arg2))
    .then((result) => {

    });

const result = await limiter.schedule(() => myFunction(arg1, arg2));