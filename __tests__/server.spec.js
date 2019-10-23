const request = require('supertest')
const app = require('../api/server')

describe('server', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/')

    expect(res.status).toEqual(200)
  })
})

/*=== tests for api key flow ===*/

describe('API Key Authentication', () => {
  it('/sauti route should be forbidden without key', async () => {
    const res = await request(app).get('/sauti')
    expect(res.status).toEqual(403)
  })

  // it("/sauti route should be forbidden without key", async () => {
  //   const res = await request(app).get("/sauti")
  //   expect(res.status).toEqual(403)
  // })
})
