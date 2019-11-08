const DBSt = require("../database/dbSTConfig");

module.exports = {
  getSautiDataClient,
  getListsOfThings,
  mcpList
};

// Helper function with filter searches for client side
// Flexible by allowing user to select whichever query they want.

async function getSautiDataClient(query) {
  let { startDate, endDate } = query;

  let entries;
  let totalCount;

  if (query.next) {
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

    entries = await queryOperation
      .where(function() {
        this.whereRaw("date < ?", [nextDate]).orWhere(function() {
          this.whereRaw("date = ?", [nextDate]).andWhereRaw("id <= ?", [
            nextId
          ]);
        });
        // .andWhereRaw("id <= ?", [nextId]);
      })

      .where("active", (query.a = 1))
      .orderBy("date", "desc")
      .orderBy("id", "desc")
      .limit(51);
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
    totalCount = await queryOperation.clone().count();
    entries = await queryOperation
      .where("active", (query.a = 1))
      .orderBy("date", "desc")
      .orderBy("id", "desc")
      .limit(51);
  }

  const lastEntry = entries[entries.length - 1];

  entries.length ? (next = `${lastEntry.date}_${lastEntry.id}`) : (next = null);
  const entriesOffset = entries.splice(0, 50);

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
function mcpList() {
  const marketQuery = marketList();
  const countryQuery = countryList();
  const productQuery = productList();
  const pcatQuery = pcatList();
  const paggQuery = paggList();
  return Promise.all([
    marketQuery,
    countryQuery,
    productQuery,
    pcatQuery,
    paggQuery
  ]).then(([markets, country, product, category, aggregator]) => {
    let total = {};
    total.countries = country;
    total.products = product;
    total.markets = markets;
    total.categories = category;
    total.aggregators = aggregator;
    return total;
  });
}

function getListsOfThings(query, selector) {
  let queryOperation = DBSt("platform_market_prices2");
  if (query === undefined) {
    query = "market";
  }
  switch (query.toLowerCase()) {
    case "market":
      return queryOperation.distinct("market").orderBy("market");
    case "country":
      return queryOperation.distinct("country").orderBy("country");
    case "source":
      return queryOperation.distinct("source").orderBy("source");
    case "product":
      return queryOperation.distinct("product").orderBy("product");
    case "category":
      return queryOperation.distinct("product_cat").orderBy("product_cat");
    case "aggregator":
      return queryOperation.distinct("product_agg").orderBy("product_agg");
    default:
      return queryOperation.distinct("market").orderBy("market");
  }
}
