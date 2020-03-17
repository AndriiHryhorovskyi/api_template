const { app } = require("../helpers");

describe("/sayHello", () => {
  test("should return Hi", () =>
    app
      .get("/sys")
      .query({ format: "json" })
      .then(res => {
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toBe("Hi");
      }));
});
