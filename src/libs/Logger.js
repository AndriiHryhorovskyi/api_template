'use strict';

const pino = require('pino');
const os = require('os');

const getLogger = ({ IS_PROD, IS_DEV, APP_NAME }) => {
  const logOptions = { name: APP_NAME };
  const nullDestination = os.platform() === 'win32' ? 'NUL' : '/dev/null';
  const stdout = 1;
  const destination =
    IS_DEV || IS_PROD
      ? pino.destination(stdout)
      : pino.destination(nullDestination);
  const logger = IS_PROD
    ? pino(logOptions, destination)
    : pino(
        { prettyPrint: { colorize: true, translateTime: true }, ...logOptions },
        destination,
      );
  return logger;
};

/**
 * Creates a new Logger
 * @class
 * @classdesc This is wrapper over logger
 * @param {Object} application - Application instance
 * @param {Object} application.config - config
 * @param {Object} application.classes - classes definitions
 */
class Logger {
  #logger;
  #appConfig;

  constructor({ config }) {
    this.#logger = getLogger(config.APP);
    this.#appConfig = config.APP;
    this.#generateWrappedMethods();
  }

  #generateWrappedMethods = () => {
    const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    // eslint-disable-next-line
    for (const method of methods) {
      this[method] = (...args) => {
        if (method === 'fatal' && this.#appConfig.IS_TEST) {
          console.log(...args); // eslint-disable-line
        }
        this.#logger[method](...args);
      };
    }
  };

  /**
   * Log uncaughtExceptions and unhandledRejections
   * @param {Function} callback - Callback function
   */
  uncaught(callback) {
    return pino.final(this.#logger, callback);
  }
}

module.exports = Logger;
