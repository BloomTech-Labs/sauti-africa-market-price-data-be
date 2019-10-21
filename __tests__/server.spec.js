const request = require("supertest")
const app = require("../api/server")

describe("server", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/")

    expect(res.statusCode).toEqual(200)
  })
})

/*=== tests for api key flow ===*/
/*
describe("apikey stuff", () => {
  it("does something", () => {
    const res = await request(app).get("/api/apikeyRoute/private")

    expect(res.statusCode).toEqual(403)
  })
}
*/
