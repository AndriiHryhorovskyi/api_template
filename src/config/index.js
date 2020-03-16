const rc = require("rc");

const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";

module.exports = rc("res_api_template", {
  PORT,
  WEBHOST: `http://127.0.0.1:${PORT}`,
  ALLOW_ORIGINS: "*",
  IS_DEV: env === "development",
  SHUTDOWN_TIMEOUT: 3000,
  TREFRESH_TIMEOUT: 5,
});
