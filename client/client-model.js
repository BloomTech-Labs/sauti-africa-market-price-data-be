const DBSt = require("../database/dbSTConfig");

module.exports = {
  getSautiDataClient,
  mcpList,
  getPlay,
  getProductPriceRangePlay,
  getPMPlay
};

// Grid table functions

// Helper function with filter searches for data table on client side
// Flexible by allowing user to select whichever query they want
// Cursor based pagination implemented for data table on client side
// We used wherein because it takes an array, we leveraged the natural behavior of the req.query object where when keys are put in multiple times their values automatically form an array on the req.query object; if it's not an array (a key is only used once) we make it an array to use the wherein //

async function getSautiDataClient(query, csvLimit) {
  let { startDate, endDate } = query;

  let entries;
  let totalCount;
  // if next value is passed in (if user is changing the page) - the next value will be a concatenation
  // of the date and id of the top result in the next page.
  if (query.next) {
    //get date and id from the next value (these are used to sort the results to get pages)
    const cursorArray = query.next.split("_");
    const nextDate = new Date(cursorArray[0]);
    const nextId = cursorArray[1];
    let queryOperation = DBSt("platform_market_prices2");

    // If user wants data from specific country/countries
    if (query.c && !Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn("country", [query.c]);
    } else if (query.c && Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn("country", query.c);
    }

    // If user wants data from specific markets
    if (query.m && !Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn("market", [query.m]);
    } else if (query.m && Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn("market", query.m);
    }
    // If user wants data from specific source
    if (query.s && !Array.isArray(query.s)) {
      queryOperation = queryOperation.whereIn("source", [query.s]);
    } else if (query.s && Array.isArray(query.s)) {
      queryOperation = queryOperation.whereIn("source", query.s);
    }

    //if user wants data from spcific product categories
    if (query.pcat && !Array.isArray(query.pcat)) {
      //pcat = product category (product_cat) -> General
      queryOperation = queryOperation.whereIn("product_cat", [query.pcat]);
    } else if (query.pcat && Array.isArray(query.pcat)) {
      queryOperation = queryOperation.whereIn("product_cat", query.pcat);
    }

    //if user wnats data from product subcategory
    if (query.pagg && !Array.isArray(query.pagg)) {
      //pagg = product_agg -> product type
      queryOperation = queryOperation.whereIn("product_agg", [query.pagg]);
    } else if (query.pagg && Array.isArray(query.pagg)) {
      queryOperation = queryOperation.whereIn("product_agg", query.pagg);
    }

    //if user wants data of specific products
    if (query.p && !Array.isArray(query.p)) {
      //p = product -> Specific product
      queryOperation = queryOperation.whereIn("product", [query.p]);
    } else if (query.p && Array.isArray(query.p)) {
      queryOperation = queryOperation.whereIn("product", query.p);
    }

    queryOperation = queryOperation.select(
      "id",
      "country",
      "market",
      "source",
      "product_cat",
      "product_agg",
      "product",
      "retail",
      "wholesale",
      "currency",
      "unit",
      "date",
      "udate"
    );

    if (startDate && endDate) {
      queryOperation = queryOperation.andWhereBetween("date", [
        startDate,
        endDate
      ]);
    }

    // of all of the results that match, find the ones whose date is less than the date in the next value,
    // or, in the case of identical dates, grab the ones whose date is identical and id is less than or equal
    // than the date and id in the passed in next value.
    entries = await queryOperation
      .where(function() {
        this.whereRaw("date < ?", [nextDate]).orWhere(function() {
          this.whereRaw("date = ?", [nextDate]).andWhereRaw("id <= ?", [
            nextId
          ]);
        });
      })

      // grab active ones, sort by date and id, return up to full page plus 1 (top of next page - used as next value)
      .where("active", (query.a = 1))
      .orderBy("date", "desc")
      .orderBy("id", "desc")
      .limit(csvLimit || 31);
  } else {
    // If user wants data from specific country/countries
    let queryOperation = DBSt("platform_market_prices2");
    if (query.c && !Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn("country", [query.c]);
    } else if (query.c && Array.isArray(query.c)) {
      queryOperation = queryOperation.whereIn("country", query.c);
    }

    // If user wants data from specific markets
    if (query.m && !Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn("market", [query.m]);
    } else if (query.m && Array.isArray(query.m)) {
      queryOperation = queryOperation.whereIn("market", query.m);
    }
    
    // If user wants data from specific source
    if (query.s && !Array.isArray(query.s)) {
      queryOperation = queryOperation.whereIn("source", [query.s]);
    } else if (query.s && Array.isArray(query.s)) {
      queryOperation = queryOperation.whereIn("source", query.s);
    }

    //if user wants data from spcific product categories
    if (query.pcat && !Array.isArray(query.pcat)) {
      //pcat = product category (product_cat) -> General
      queryOperation = queryOperation.whereIn("product_cat", [query.pcat]);
    } else if (query.pcat && Array.isArray(query.pcat)) {
      queryOperation = queryOperation.whereIn("product_cat", query.pcat);
    }

    //if user wnats data from product subcategory
    if (query.pagg && !Array.isArray(query.pagg)) {
      //pagg = product_agg -> product type
      queryOperation = queryOperation.whereIn("product_agg", [query.pagg]);
    } else if (query.pagg && Array.isArray(query.pagg)) {
      queryOperation = queryOperation.whereIn("product_agg", query.pagg);
    }

    //if user wants data of specific products
    if (query.p && !Array.isArray(query.p)) {
      //p = product -> Specific product
      queryOperation = queryOperation.whereIn("product", [query.p]);
    } else if (query.p && Array.isArray(query.p)) {
      queryOperation = queryOperation.whereIn("product", query.p);
    }

    queryOperation = queryOperation.select(
      "id",
      "country",
      "market",
      "source",
      "product_cat",
      "product_agg",
      "product",
      "retail",
      "wholesale",
      "currency",
      "unit",
      "date",
      "udate"
    );

    if (startDate && endDate) {
      queryOperation = queryOperation.andWhereBetween("date", [
        startDate,
        endDate
      ]);
    }

    // total count of results for entire query
    totalCount = await queryOperation.clone().count();
    entries = await queryOperation

      .where("active", (query.a = 1))
      .orderBy("date", "desc")
      .orderBy("id", "desc")
      .limit(csvLimit || 31);
  }
  // last entry of entries is the top entry of the next page
  const lastEntry = entries[entries.length - 1];
  //concatenate the date and id of the lastEntry
  entries.length ? (next = `${lastEntry.date}_${lastEntry.id}`) : (next = null);
  //grab all but the last lastEntry (this will be the page you return)
  const entriesOffset = entries.splice(0, csvLimit || 30);

  const firstEntry = entriesOffset[0];
  entriesOffset.length
    ? (prev = `${firstEntry.date}_${firstEntry.id}`)
    : (prev = null);

  return {
    records: entriesOffset,
    next: next,
    prev: prev,
    count: totalCount
  };
}

//these functions are declared here to be used in the mcpList function below //
//
function marketList() {
  return DBSt("platform_market_prices2")
    .distinct("market")
    .orderBy("market");
}
function countryList() {
  return DBSt("platform_market_prices2")
    .distinct("country")
    .orderBy("country");
}
function sourceList() {
  return DBSt("platform_market_prices2")
    .distinct("source")
    .orderBy("source");
}
function productList() {
  return DBSt("platform_market_prices2")
    .distinct("product")
    .orderBy("product");
}
function pcatList() {
  return DBSt("platform_market_prices2")
    .distinct("product_cat")
    .orderBy("product_cat");
}
function paggList() {
  return DBSt("platform_market_prices2")
    .distinct("product_agg")
    .orderBy("product_agg");
}
//
// fn for serving up lists  to the grid filter inputs //
function mcpList() {
  const marketQuery = marketList();
  const countryQuery = countryList();
  const sourceQuery = sourceList();
  const productQuery = productList();
  const pcatQuery = pcatList();
  const paggQuery = paggList();
  return Promise.all([
    marketQuery,
    countryQuery,
    sourceQuery,
    productQuery,
    pcatQuery,
    paggQuery
  ]).then(([markets, country, source, product, category, aggregator]) => {
    let total = {};
    total.countries = country;
    total.products = product;
    total.sources = source;
    total.markets = markets;
    total.categories = category;
    total.aggregators = aggregator;
    return total;
  });
}

// End of Grid table functions

// Playground functions
// filter playground function //
// this playground endpoint's route is in sever.js //
function getPlay(query) {
  let queryOperation = DBSt("platform_market_prices2");

  // If user wants data from specific country/countries
  if (query.c && !Array.isArray(query.c)) {
    queryOperation = queryOperation.whereIn("country", [query.c]);
  } else if (query.c && Array.isArray(query.c)) {
    queryOperation = queryOperation.whereIn("country", query.c);
  }

  // If user wants data from specific markets
  if (query.market && !Array.isArray(query.market)) {
    queryOperation = queryOperation.whereIn("market", [query.market]);
  } else if (query.market && Array.isArray(query.market)) {
    queryOperation = queryOperation.whereIn("market", query.market);
  }
  // If user wants data from specific source
  if (query.source && !Array.isArray(query.source)) {
    queryOperation = queryOperation.whereIn("source", [query.source]);
  } else if (query.source && Array.isArray(query.source)) {
    queryOperation = queryOperation.whereIn("source", query.source);
  }

  //if user wants data from spcific product categories
  if (query.pcat && !Array.isArray(query.pcat)) {
    //pcat = product category (product_cat) -> General
    queryOperation = queryOperation.whereIn("product_cat", [query.pcat]);
  } else if (query.pcat && Array.isArray(query.pcat)) {
    queryOperation = queryOperation.whereIn("product_cat", query.pcat);
  }

  //if user wnats data from product subcategory
  if (query.pagg && !Array.isArray(query.pagg)) {
    //pagg = product_agg -> product type
    queryOperation = queryOperation.whereIn("product_agg", [query.pagg]);
  } else if (query.pagg && Array.isArray(query.pagg)) {
    queryOperation = queryOperation.whereIn("product_agg", query.pagg);
  }

  //if user wants data of specific products
  if (query.p && !Array.isArray(query.p)) {
    //p = product -> Specific product
    queryOperation = queryOperation.whereIn("product", [query.p]);
  } else if (query.p && Array.isArray(query.p)) {
    queryOperation = queryOperation.whereIn("product", query.p);
  }

  return queryOperation
    .select(
      "country",
      "market",
      "source",
      "product_cat",
      "product_agg",
      "product",
      "retail",
      "wholesale",
      "currency",
      "unit",
      "date",
      "udate"
    )
    .orderBy("date", "desc")
    .where("active", (query.a = 1))
    .limit(1);
}

function getProductPriceRangePlay({ product, startDate, endDate }) {
  return DBSt("platform_market_prices2")
    .select("*")
    .where("product", product)
    .andWhereBetween("date", [startDate, endDate])
    .limit(1);
}

// get price of product in a specific market for playground //
function getPMPlay(query) {
  const { product, market } = query;
  let queryOperation = DBSt("platform_market_prices2");
  return queryOperation
    .select(
      "market",
      "source",
      "country",
      "currency",
      "product",
      "retail",
      "wholesale",
      "date",
      "udate"
    )
    .where("product", `${product}`)
    .andWhere("market", `${market}`)
    .orderBy("date", "desc")
    .limit(1);
}

// End of Playground functions
