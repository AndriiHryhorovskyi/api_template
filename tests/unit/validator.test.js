const { validator } = require("lib");

describe("validator lib", () => {
  test("invalid schema", async () => {
    const validate = () => validator.validate(null, "testData");
    const errorMsg = "Invalid schema";
    await expect(validate()).rejects.toThrow(errorMsg);
  });

  test("invalid data", async () => {
    const validate = () => validator.validate(validator.schemas.test);
    const errorMsg = "Data to validation are not received";
    await expect(validate()).rejects.toThrow(errorMsg);
  });

  test("validation error", async () => {
    const result = await validator.validate(validator.schemas.test, {});
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("Invalid param - name");
  });

  test("validation successful", async () => {
    const data = { name: "testName" };
    const result = await validator.validate(validator.schemas.test, data);
    expect(result).toMatchObject(data);
  });
});
