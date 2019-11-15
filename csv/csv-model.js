const DBSt = require("../database/dbSTConfig");

module.exports = {
  getSautiDataCSV
};

// Grid table functions

// Helper function with filter searches for client side
// Flexible by allowing user to select whichever query they want.

async function getSautiDataCSV(query) {
  let { startDate, endDate } = query;

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

  const entries = await queryOperation
    .where("active", (query.a = 1))
    .orderBy("date", "desc");

  return {
    records: entries
  };
}
