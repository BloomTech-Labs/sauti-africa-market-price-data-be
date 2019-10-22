module.exports = {
    queryProduct,
    queryProductMarket
} 


function queryProduct (req,res,next){
    if(req.query.product === undefined)
    {
        res.status(400).json({errorMessage:"Please supply the query parameter of 'product' "})
    }
    else{
        next()
    }
}

function queryProductMarket(req,res,next){
    if(req.query.product === undefined)
    {
        res.status(400).json({errorMessage:"Please supply the query parameter of 'product' "})
    }
    else if(req.query.market === undefined){
        res.status(400).json({errorMessage:"Please supply the query parameter of 'market' "})
    }
    else{
        next()
    }
}

const validParams = ["country", "currency"];
const query = {
  country: "Uganda",
  currency: "UGX",
  inflationRate: "0.2"
};
const filterQuery = (query, validParams) => {
  let result = {};
  for (let key in query) {
    if (query.hasOwnProperty(key) && validParams.includes(key)) {
      result[key] = query[key];
    }
  }
  return result;
};
const whereParams = filterQuery(query, validParams);
console.log(whereParams);

