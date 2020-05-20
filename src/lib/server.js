'use strict';

const http = require('http');
const https = require('https');

const listener = require('./listener');
const Semaphore = require('./semaphore.js');

const TRANSPORTS = { http, https };

const clients = new Map();

const closeClients = () => {
  // eslint-disable-next-line
  for (const [connection, client] of clients.entries()) {
    clients.delete(connection);
    client.error(503);
    connection.destroy();
  }
};

class Server {
  constructor(config, application) {
    this.config = config;
    this.application = application;
    const { PORTS, HOST, TRANSPORT, CONCURRENCY, QUEUE } = config;
    this.semaphore = new Semaphore(CONCURRENCY, QUEUE.SIZE, QUEUE.TIMEOUT);
    const { threadId } = application.worker;
    const PORT = PORTS[threadId - 1 || 0];
    const lib = TRANSPORTS[TRANSPORT];
    const handler = listener(clients, config, this.semaphore, application);
    this.instance = lib.createServer({ ...application.cert }, handler);
    this.instance.listen(PORT, HOST);
  }

  async close() {
    this.instance.close(err => {
      if (err) this.application.logger.error("Can't stop server", err);
    });
    const { SHUTDOWN_TIMEOUT } = this.config;
    await this.application.api.timeout(SHUTDOWN_TIMEOUT);
    closeClients();
    this.application.logger.info('Server closed');
  }
}

module.exports = Server;
