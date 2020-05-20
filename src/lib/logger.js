'use strict';

const pino = require('pino');
const Client = require('./client');

const getLogger = (IS_PROD, workerName) => {
  const logOptions = { name: `worker-${workerName}` };
  const destination = pino.destination(1);
  const logger = IS_PROD
    ? pino(logOptions, destination)
    : pino(
        { prettyPrint: { colorize: true, translateTime: true }, ...logOptions },
        destination,
      );
  return logger;
};

class Logger {
  #log;

  constructor(config, workerName) {
    this.config = config;
    this.logger = getLogger(config.IS_PROD, workerName);
    this.#log = (msg, obj = {}, lvl = 'info', ...args) => {
      let client = null;
      let logObj = obj;

      if (args[0] instanceof Client) client = args.shift();
      else if (obj instanceof Client) {
        client = obj;
        logObj = {};
      }

      if (client) {
        const { id: reqId, req } = client;
        const { method, url, headers, socket } = req;
        const reqInfo = {
          id: reqId,
          ip: socket.remoteAddress,
          port: socket.remotePort,
          method,
          url,
          headers,
        };
        logObj = Object.assign(logObj, { req: reqInfo });
      }
      this.logger[lvl](logObj, msg, ...args);
    };
  }

  debug(msg = '', obj = {}, ...args) {
    this.#log(msg, obj, 'debug', ...args);
  }

  trace(msg = '', obj = {}, ...args) {
    this.#log(msg, obj, 'trace', ...args);
  }

  log(msg = '', obj = {}, ...args) {
    this.#log(msg, obj, 'info', ...args);
  }

  info(msg = '', obj = {}, ...args) {
    this.#log(msg, obj, 'info', ...args);
  }

  warn(msg = '', obj = {}, ...args) {
    this.#log(msg, obj, 'warn', ...args);
  }

  error(msg = '', obj = {}, ...args) {
    this.#log(msg, obj, 'error', ...args);
  }

  uncaught(callback) {
    return pino.final(this.logger, callback);
  }
}

module.exports = Logger;
