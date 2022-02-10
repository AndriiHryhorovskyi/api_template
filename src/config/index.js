'use strict';

const rc = require('rc');

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const env = process.env.NODE_ENV || 'development';
const IS_DEV = env === 'development';
const IS_PROD = env === 'production';
const IS_TEST = !IS_DEV && !IS_PROD;
const appName = 'petLayout';

/** Application default config is here */
module.exports = rc(appName, {
  APP: {
    APP_NAME: appName,
    IS_DEV,
    IS_PROD,
    IS_TEST,
  },

  REST_API: {
    SERVER: {
      HOST: host,
      PORT: port,
      LONG_RESPONSE: 120_000, // 1 minute
      SHUTDOWN_TIMEOUT: IS_PROD ? 5000 : 0,
    },
  },

  MONGO: {
    URI: 'mongodb://localhost:27017',
    POOL_SIZE: 5,
    CONNECTION_TIMEOUT: 5000,
  },

  SESSION: {
    EXP: 60_000, // time in ms. 0 - infinite session
    SECRET: 'secret',
    SALT_ROUNDS: 10,
  },
});
