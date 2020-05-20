'use strict';

const { Pool } = require('pg');

const getConnection = (config, logger) =>
  new Promise(resolve => {
    const {
      HOST: host,
      DATABASE: database,
      USER: user,
      PASSWORD: password,
      PORT: port,
      POOL_SIZE: max,
      CONNECTION_TIMEOUT_MS: connectionTimeoutMillis,
      IDDLE_TIMEOUT_MS: idleTimeoutMillis,
    } = config;

    const pool = new Pool({
      host,
      database,
      user,
      password,
      port,
      connectionTimeoutMillis,
      idleTimeoutMillis,
      max,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    pool.on('error', err => {
      logger.warn('Unexpected error on idle client', err);
    });

    pool.once('connect', () => {
      logger.info('Database connection established');
      resolve(pool);
    });

    pool.connect().then(client => client.release());
  });

module.exports = getConnection;
