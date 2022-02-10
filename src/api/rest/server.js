'use strict';

const listener = require('./listener');

const clients = new Map();

const closeClients = () => {
  // eslint-disable-next-line
  for (const [req, res] of clients.entries()) {
    clients.delete(req);
    res.status(503).json({
      error: {
        message: 'Service unavailable',
        description: 'Server closed',
      },
    });
    req.connection.destroy();
  }
};

/**
 * Creates a new Server
 * @class
 * @param {Object} params - Server params
 * @param {Object} params.config - Server config
 * @param {Object} params.libs - Application libs
 * @param {Object} params.logger - Application logger
 * @param {Object} params.certs - Ssl certificates
 * @param {Object} params.useCases - Application use cases
 */
class Server {
  constructor({ config, useCases, libs, constants, certs, logger }) {
    this.config = config;
    this.libs = libs;
    this.logger = logger;
    this.certs = certs;
    this.useCases = useCases;
    this.constants = constants;
  }

  start() {
    const libName = this.certs?.key && this.certs?.cert ? 'https' : 'http';
    this.logger.info(`[REST API] The ${libName} is used`);
    const handler = listener({
      clients,
      config: this.config,
      libs: this.libs,
      useCases: this.useCases,
      constants: this.constants,
      logger: this.logger,
    });
    this.instance = this.libs[libName].createServer({ ...this.certs }, handler);
    const { PORT, HOST } = this.config.REST_API.SERVER;
    this.instance.listen(PORT, HOST);
    this.logger.info(`[REST API] Server listening on port ${PORT}`);
    return this.instance;
  }

  async stop() {
    const logMsg = '[REST API] Server closed';
    if (!this.instance) {
      this.logger.info(logMsg);
      return;
    }
    this.instance.close(err => {
      if (err) this.logger.error(err);
    });
    const { SHUTDOWN_TIMEOUT } = this.config.REST_API.SERVER;
    await this.libs.timeout(SHUTDOWN_TIMEOUT);
    closeClients();
    this.logger.info(logMsg);
  }
}

module.exports = Server;
