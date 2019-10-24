# API Documentation

#### 1️⃣ Backend delpoyed at [heroku](https://sauti-africa-market-master.herokuapp.com/) <br> <br> View the API Docs & Examples at [Postman](https://documenter.getpostman.com/view/8666055/SVtZvkxB?version=latest#379d2949-1e20-47be-9f13-9d142581a8c9)

## 1️⃣ Getting started

To get the server running locally:

- Clone this repo
- **npm i** to install all required dependencies
- **npm run server** to start the local server
- **npm run test** to start server using testing environment
- Acquire API key and pass it as header to any available routes of developer route. Consult API Docs on Postman(see above)

### Backend framework goes here

🚫 Why did you choose this framework?

- We chose Node.js/Express because we were familiar with the tech and could leverage the use of middleware.
- We chose knex as our query builder because we were familiar with it and were able to build the appropriate queries very quickly.
- Custom Validation Middleware to ensure query parameters are received correctly and throw meaningful errors.
- Point Four

## 2️⃣ Endpoints

#### Developer Routes

- Access Control: Access of these endpoints given to developers through API keys.
- All endpoints make use of query strings

| Method | Example Endpoint                              | Description                                                                                                 |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| GET    | `/sauti/developer/product/late/pricebymarket` | return the latest price of a particular product from a particular market                                    |
| GET    | `/sauti/developer/lists`                      | returns a list of a either markets, countries, products, or sources                                         |
| GET    | `/sauti/developer/product/range`              | returns price information on a particular product across a date range                                       |
| GET    | `/sauti/developer/filter`                     | filters data with countries, markets, sub levels of products, and can set up pagination with count and page |
| GET    | `/sauti/developer/product/latestprice`        | returns the latest price of a particular product across all markets                                         |

#### Client Routes

| Method | Endpoint        | Access Control | Description                                                                                    |
| ------ | --------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| GET    | `/sauti/client` | all users      | Performs Big query as Developer Filter (This endpoint will be expanded for Release Cycle V1.2) |

#### API KEY Route

//Fill some info here

# Data Model

🌴Database is provided by our Stakeholder from Sauti Africa

#### 2️⃣ Market Price Table

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

#### USERS

---

```
{
  id: UUID
  organization_id: UUID foreign key in ORGANIZATIONS table
  first_name: STRING
  last_name: STRING
  role: STRING [ 'owner', 'supervisor', 'employee' ]
  email: STRING
  phone: STRING
  cal_visit: BOOLEAN
  emp_visit: BOOLEAN
  emailpref: BOOLEAN
  phonepref: BOOLEAN
}
```

## 2️⃣ Actions

`getSautiData(query)` -> Returns all sauti data that can be filtered with queries for countries, markets, and products.

`latestPriceAcrossAllMarkets(query)` -> Takes in a product as a query and returns a product's latest price across all markets.

`latestPriceByMarket(query)` -> Takes a product and a market as queries and returns the latest price of the product at that market.

`getListsOfThings(query, selector)` -> Returns a list of countries, markets, sources, or products.

`getProductPriceRange(product, startDate, endDate, count, page` -> Returns product price over a range of dates.

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.
Please contact a member of the team to acquire them.

create a .env file that includes the following:

- STAGING_DB - optional development db for using functionality not available in SQLite
- NODE\*ENV - set to "development" until ready for "production"
- MOESIF_ID - To enable Backend Analytics via Moesif
- ST_DATABASE_URL - Connection string to Sauti Market Prices MYSQL Database

- JWT*SECRET - you can generate this by using a python shell and running import random''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&amp;*(-_=+)') for i in range(50)])
  _ SENDGRID_API_KEY - this is generated in your Sendgrid account \* stripe_secret - this is generated in the Stripe dashboard

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
