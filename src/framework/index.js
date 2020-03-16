const express = require("express");
const { logger } = require("../lib");
const router = require("./routeAdapter.js");
const { ALLOW_ORIGINS } = require("../config");

const app = express();

// setup CORS
app.use((req, res, next) => {
  const allowOrigins = ALLOW_ORIGINS.split(" ");
  const origin = req.headers.Origin || "*";
  const allowedOrigin = allowOrigins.find(o => o === origin);
  const allowedHeaders = req.headers["Access-Control-Request-Headers"] || "*";
  const allowedMethods = "GET,OPTIONS";

  res.set({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": allowedMethods,
    "Access-Control-Allow-Headers": allowedHeaders,
  });

  if (req.method === "OPTIONS") return res.sendStatus(200);
  return next();
});

app.use(router);

app.use((req, res) => {
  res.status(404).end();
});

// eslint-disable-next-line
router.use((err, req, res, next) => {
  logger.error(`Internal server error: `, err);

  const status = 500;
  const errorMsg = "Internal server error";

  return res.status(status).json({ error: { message: errorMsg } });
});

module.exports = app;
