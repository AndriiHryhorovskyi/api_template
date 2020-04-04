const rc = require("rc");

const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";
const IS_DEV = env === "development";
const IS_PROD = env === "production";

module.exports = rc("res_api_template", {
  PORT,
  IS_DEV,
  IS_PROD,
  ALLOW_ORIGINS: "*",
  REFRESH_TIMEOUT: 5,
  WEBHOST: `http://127.0.0.1:${PORT}`,
  SHUTDOWN_TIMEOUT: IS_PROD ? 3000 : 0,
});
