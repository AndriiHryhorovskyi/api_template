'use strict';

const express = require('express');
const Client = require('./client');

const app = express();
const NS_PER_MS = BigInt(1e6);
const API_URL = '/api';

app.disable('x-powered-by');

const listener = (clients, config, semaphore, application) => {
  const { logger, router } = application;
  const { LONG_RESPONSE, CORS } = config;

  // setup CORS
  app.use((req, res, next) => {
    const allowOrigins = CORS.ALLOW_ORIGINS.split(' ');
    const origin = req.headers.Origin || '*';
    const allowedOrigin = allowOrigins.find(o => o === origin);
    const allowedHeaders = req.headers['Access-Control-Request-Headers'] || '*';
    const allowedMethods = 'GET,OPTIONS';

    res.set({
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': allowedMethods,
      'Access-Control-Allow-Headers': allowedHeaders,
    });

    if (req.method === 'OPTIONS') return res.sendStatus(200);
    return next();
  });

  // disable caching for api
  app.use((req, res, next) => {
    if (req.url.startsWith(API_URL))
      res.set('Cache-Control', 'private, no-cache, no-store');
    return next();
  });

  app.use(async (req, res, next) => {
    const client = new Client(req, res);
    const { connection } = req;
    clients.set(connection, client);
    req.client = client; // because express
    let handled = false;

    logger.info('New reques', client);

    if (req.url.startsWith(API_URL)) {
      try {
        await semaphore.enter();
        handled = true;
      } catch (err) {
        logger.warn(err.message);
        err.status = 504;
        next(err);
      }
    }

    const timer = setTimeout(() => {
      if (client.finished) return;
      logger.warn('Request terminated: too long processing', client);
      const err = { status: 504 };
      next(err);
    }, LONG_RESPONSE);

    res.on('finish', () => {
      client.finished = true;
      const timeDiff = process.hrtime.bigint() - client.arrivalTime;
      const responseTime = (timeDiff / NS_PER_MS).toString();
      const { statusCode } = res;
      logger.info(
        'Request complited',
        { res: { responseTime, statusCode } },
        client,
      );
    });

    res.on('close', () => {
      client.finished = true;
      clearTimeout(timer);
      clients.delete(connection);
      if (req.url.startsWith(API_URL) && handled) semaphore.leave();
    });
    next();
  });

  app.use(router);
  app.use(req => req.client.error(404));

  // eslint-disable-next-line
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    let errorMsg;
    if (status === 500) {
      logger.error(`Internal server error: `, err, req.client);
      errorMsg = 'Internal server error';
    }
    req.client.error(status, errorMsg);
  });

  return app;
};

module.exports = listener;
