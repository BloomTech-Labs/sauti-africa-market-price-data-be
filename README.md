

# API Documentation

#### Backend deployed at [heroku](https://sauti-africa-market-master.herokuapp.com/) <br> <br> View the API Docs & Examples at [Postman](https://price-api.sautiafrica.org/docs

## Getting started

To get the server running locally:

- Clone this repo
- **npm i** to install all required dependencies
- **npm run server** to start the local server
- **npm run test** to start server using testing environment
- **install redis** to allow API Keys to be processed. Please install redis from [here](https://redis.io/)
- Acquire the correct .env file to ensure proper operation
- Acquire API key and pass it as header to any available routes of developer route. Consult API Docs on Postman(see above)

### NodeJS/Express Server

- We chose Node.js/Express because we were familiar with the tech and could leverage the use of middleware.
- We chose knex as our query builder because we were familiar with it and were able to build the appropriate queries very quickly.
- Custom Validation Middleware to ensure query parameters are received correctly and throw meaningful errors.

## Endpoints

#### Developer Route

- Access Control: Access of these endpoints given to developers through API keys.
- All endpoints make use of query strings

| Method | Example Endpoint                              | Description                                                                                                 |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| GET    | `/sauti/developer/product/late/pricebymarket` | return the latest price of a particular product from a particular market                                    |
| GET    | `/sauti/developer/lists`                      | returns a list of a either markets, countries, products, or sources                                         |
| GET    | `/sauti/developer/product/range`              | returns price information on a particular product across a date range                                       |
| GET    | `/sauti/developer/filter`                     | filters data with countries, markets, sub levels of products, and can set up pagination with count and page |
| GET    | `/sauti/developer/product/latestprice`        | returns the latest price of a particular product across all markets                                         |

#### Client Route

| Method | Endpoint                          | Access Control | Description                                                                  |
| ------ | --------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| GET    | `/sauti/client`                   | all FE users   | Performs query filtering with pagination for the data grid                   |
| GET    | `/sauti/client/superlist`         | all FE users   | Performs queries to serve up to the grid for filter inputs                   |
| GET    | `/sauti/client/playground/date`   | all FE users   | Performs query for a product and date range which returns 1 record           |
| GET    | `/sauti/client/playground/latest` | all FE users   | Performs query for latest price by product and market which returns 1 record |
| GET    | `/sauti/`                         | all FE users   | Playground filter endpoint which returns 1 record                            |

#### API KEY Route

| Method | Endpoint                   | Access Control | Description                                                                                                                                                                                                                                                  |
| ------ | -------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/api/apikeyRoute/private` | all users      | Takes in jwt from Auth0 in headers and a user id from the body. Generates a new API key and hashes it. Checks if user exists in db. If user exists, entry is updated with new hashed API key, else a new entry is added with the user id and the hashed key. |

# Data Model

🌴Database is provided by our Stakeholder from Sauti Africa

#### Market Price Table

---

```
{
  id: int(5)
  source: varchar(20)
  country: varchar(5)
  market: varchar(300)
  product_cat: varchar(300)
  product_agg: varchar(300)
  product: varchar(300)
  date: datetime
  retail: int(7)
  wholesale:int(7)
  currency: varchar(3)
  unit: varchar(20)
  active: tinyint(1)
  udate: timestamp
}
```

#### API Keys

---

```
{
  id: int
  key: text
  user_id: text
}
```

## Actions

`getSautiData(query)` -> Returns all sauti data that can be filtered with queries for countries, markets, and products.

`latestPriceAcrossAllMarkets(query)` -> Takes in a product as a query and returns a product's latest price across all markets.

`latestPriceByMarket(query)` -> Takes a product and a market as queries and returns the latest price of the product at that market.

`getListsOfThings(query, selector)` -> Returns a list of countries, markets, sources, or products.

`getProductPriceRange(product, startDate, endDate, count, page` -> Returns product price over a range of dates.

## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.
Please contact a member of the team to acquire them.

create a .env file that includes the following:

- STAGING_DB - optional development db for using functionality not available in SQLite
- NODE\*ENV - set to "development" until ready for "production"
- MOESIF_ID - To enable Backend Analytics via Moesif
- ST_DATABASE_URL - Connection string to Sauti Market Prices MYSQL Database

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/sauti-africa-market-price-data-fe/blob/master/README.md) for details on the frontend of our project.
