'use strict';

const joi = require('joi');

module.exports = joi.object({
  APP: joi
    .object({
      APP_NAME: joi.string().required(),
      IS_DEV: joi.boolean().required(),
      IS_PROD: joi.boolean().required(),
      IS_TEST: joi.boolean().required(),
    })
    .required(),

  REST_API: joi
    .object({
      SERVER: joi
        .object({
          HOST: joi.string().required(),
          PORT: joi.number().integer().required(),
          LONG_RESPONSE: joi.number().integer().min(0).required(),
          SHUTDOWN_TIMEOUT: joi.number().integer().min(0).required(),
        })
        .required(),
    })
    .required(),

  MONGO: joi
    .object({
      URI: joi.string().required(),
      POOL_SIZE: joi.number().integer().min(0).required(),
      CONNECTION_TIMEOUT: joi.number().integer().greater(0).required(),
    })
    .required(),

  SESSION: joi
    .object({
      EXP: joi.number().integer().min(0).required(),
      SECRET: joi.string().required(),
      SALT_ROUNDS: joi.number().integer().greater(0).required(),
    })
    .required(),
});
