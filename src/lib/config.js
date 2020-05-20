'use strict';

const rc = require('rc');

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const IS_DEV = env === 'development';
const IS_PROD = env === 'production';

module.exports = rc('res_api_template', {
  APP: {
    IS_DEV,
    IS_PROD,
  },
  SERVER: {
    HOST: '127.0.0.1',
    TRANSPORT: 'http',
    PORTS: [port],
    LONG_RESPONSE: 30000,
    SHUTDOWN_TIMEOUT: IS_PROD ? 5000 : 0,
    CONCURRENCY: 1000,
    QUEUE: {
      SIZE: 2000,
      TIMEOUT: 3000,
    },
    CORS: {
      ALLOW_ORIGINS: '*',
    },
  },
  DATABASE: {
    HOST: 'ec2-54-247-89-181.eu-west-1.compute.amazonaws.com',
    DATABASE: 'd13k5lmrjdb8i8',
    USER: 'iuwvxybwbfdnjc',
    PASSWORD:
      '979961561cb071f63b84f78b53033e78a6aa47be5195b76b9c363bf501a167c7',
    PORT: 5432,
    POOL_SIZE: 20,
    CONNECTION_TIMEOUT_MS: 0,
    IDDLE_TIMEOUT_MS: 10,
  },
});
