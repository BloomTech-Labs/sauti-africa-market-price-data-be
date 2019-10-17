const request = require("supertest");
const app = require("./server");

describe("server", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toEqual(200);
  });
});
