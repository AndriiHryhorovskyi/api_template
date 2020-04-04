const express = require("express");
const expressPino = require("express-pino-logger");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("http-status-codes");
const { logger, errorBody } = require("../lib");
const router = require("./routeAdapter.js");
const { ALLOW_ORIGINS } = require("../config");

const app = express();

// Remove the X-Powered-By headers.
app.disable("x-powered-by");

app.use(expressPino({ logger }));

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

// disable caching for api
app.use((req, res, next) => {
  res.set("Cache-Control", "private, no-cache, no-store");
  return next();
});

app.use(router);

app.use((req, res) => {
  res.status(NOT_FOUND).end();
});

// eslint-disable-next-line
router.use((err, req, res, next) => {
  logger.error(err, "Internal server error");

  const errBody = errorBody("Internal server error");

  res.status(INTERNAL_SERVER_ERROR).json(errBody);
});

module.exports = app;
