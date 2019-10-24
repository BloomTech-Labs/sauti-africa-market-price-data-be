require('dotenv').config({ path: '.env' })
const request = require('supertest')
const server = require('../api/server')

//All of testing are done without Auth on routes
describe('server', () => {
  it('returns 200 for developer/filter route', async () => {
    const res = await request(server).get('/sauti/developer/filter')
    expect(res.status).toEqual(200)
  })
  it('returns 200 for a big query', async () => {
    const res = await request(server).get(
      '/sauti/developer/filter/?product=apples&market=mombasa&count=200'
    )

    expect(res.type).toMatch(/json/i)
  })
  it('returns 404 for bad query', async () => {
    const message = {
      message:
        "Records don't exist here, change the query parameters or change page no. "
    }
    const res = await request(server).get(
      '/sauti/developer/filter/?product=apples&market=mombasa&count=200&page=50'
    )
    expect(res.status).toEqual(404)
    expect(res.body).toStrictEqual(message)
  })
  it('prints message about exceeding count > 500', async () => {
    const message = 'Each page can have maximum of 500 records'
    const res = await request(server).get(
      '/sauti/developer/filter/?product=apples&market=mombasa&count=5000&page=5'
    )
    expect(res.status).toEqual(200)
    expect(res.body.message).toStrictEqual(message)
  })
})

// describe("Get some env", () => {
//   it("prints some env", () => {
//     console.log(process.env.ST_DATABASE_URL)
//   })
// })

describe('Latest price of product across all markets', () => {
  it('returns 200 for developer/product/latestprice', async () => {
    const res = await request(server).get(
      '/sauti/developer/product/latestprice/?product=apples'
    )
    expect(res.status).toEqual(200)
  })
  it('returns 404 for error entering product', async () => {
    const message = {
      message:
        "The product entered doesn't exist in the database, please check the list of available products"
    }
    const res = await request(server).get(
      '/sauti/developer/product/latestprice/?product=apple'
    )
    expect(res.body).toStrictEqual(message)
    expect(res.status).toBe(404)
  })
})

describe('Latest price of a product across a single market', () => {
  it('returns a 200 for developer/product/pricebymarket', async () => {
    const res = await request(server).get(
      '/sauti/developer/product/pricebymarket/?product=yellow%20beans&market=lira'
    )
    expect(res.status).toEqual(200)
  })
  it('returns 404 for incorrect product and checks the message', async () => {
    const message = {
      message:
        "That product and market combination doesn't exist, please check spelling and list of products and markets"
    }

    const res = await request(server).get(
      '/sauti/developer/product/pricebymarket/?product=beans&market=lira'
    )

    expect(res.body).toStrictEqual(message)
    expect(res.status).toBe(404)
  })
})
describe('The List endpoint returns lists of sources, markets, products, markets', () => {
  it('returns a 200 for developer/product/list', async () => {
    const res = await request(server).get('/sauti/developer/lists/?list=market')
    expect(res.status).toBe(200)
  })
  it('returns a list of markets even if the key is inputted wrong', async () => {
    const expected = [{ market: 'Lira' }]
    const res = await request(server).get('/sauti/developer/lists/?list=mark')
    expect(res.body).toEqual(expect.arrayContaining(expected))
  })
})

describe('Product price over a range of dates', () => {
  it('returns a 200 for developer/product/range', async () => {
    const res = await request(server).get(
      '/sauti/developer/product/range/?product=yellow%20beans&startDate=2019-09-10&endDate=2019-10-28'
    )
    expect(res.status).toEqual(200)
  })
  it('returns a 500 for developer/product/range if query is incorrect by requesting two products', async () => {
    const res = await request(server).get(
      '/sauti/developer/product/range/?product=beans&product=yellow%20beans&startDate=2019-09-10&endDate=2019-10-28'
    )
    expect(res.status).toEqual(500)
  })
})
