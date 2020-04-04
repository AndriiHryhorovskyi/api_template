const { app } = require("../helpers");

describe("/sys/", () => {
  const url = "/api/sys/";

  test("should return Hi", async () => {
    const response = await app.get(url);

    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBe("Hi");
  });
});
