'use strict';

const fs = require('fs');

const fsp = fs.promises;
const path = require('path');
const util = require('util');
const zlib = require('zlib');
const events = require('events');

const libs = require('./libs');
const Server = require('./server');
const config = require('./config');
const Logger = require('./logger.js');
const getRouter = require('./router');
const getDbConnection = require('./db');
const loadResource = require('./loadResource');

const APP_PATH = process.cwd();
const CERT_PATH = path.join(APP_PATH, 'cert');
const STATIC_PATH = path.join(APP_PATH, 'src/static');
const STATIC_PATH_LENGTH = STATIC_PATH.length;

const { EventEmitter } = events;
const gzip = util.promisify(zlib.gzip);

class Application extends EventEmitter {
  constructor(worker) {
    super();
    this.closing = false;
    this.worker = worker;
    this.api = libs;
    this.cache = new Map();
    this.cert = getPem();
    this.config = config;
    this.logger = new Logger(config.APP, worker.name);
    if (!Object.keys(this.cert).length)
      this.logger.info('SSL certificates not found. HTTP will be used.');
    getDbConnection(config.DATABASE, this.logger)
      .then(dbConnection => {
        this.db = dbConnection;
        this.dal = loadResource('dal', {
          db: this.db,
          api: this.api,
          logger: this.logger,
        });
        this.services = loadResource('services', {
          dal: this.dal,
          api: this.api,
        });
        this.controllers = loadResource('controllers', {
          api: this.api,
          cache: this.cache,
          logger: this.logger,
          services: this.services,
        });
        this.routes = loadResource('routes', { ctrls: this.controllers });
        this.router = getRouter(this.routes);
        return this.cacheDirectory(STATIC_PATH);
      })
      .then(() => {
        this.server = new Server(config.SERVER, this);
        this.emit('started');
      });
  }

  async shutdown() {
    this.closing = true;
    await this.server.close();
    await this.freeResources();
  }

  async freeResources() {
    this.logger.info('Free resources');
    await this.db.end();
    this.logger.info('Database connections closed');
  }

  async cacheFile(filePath) {
    const key = filePath.substring(STATIC_PATH_LENGTH);
    try {
      const dataBuffer = await fsp.readFile(filePath);
      const data = await gzip(dataBuffer);
      this.cache.set(key, data);
    } catch (err) {
      this.logger.error("Cant't read file", err);
      if (err.code !== 'ENOENT') throw err;
    }
  }

  async cacheDirectory(directoryPath) {
    const files = await fsp.readdir(directoryPath, { withFileTypes: true });

    /* eslint-disable */
    for (const file of files) {
      const filePath = path.join(directoryPath, file.name);
      if (file.isDirectory()) await this.cacheDirectory(filePath);
      else await this.cacheFile(filePath);
    }
    /* eslint-enable */

    fs.watch(directoryPath, (event, fileName) => {
      const filePath = path.join(directoryPath, fileName);
      this.cacheFile(filePath);
    });
  }
}

function getPem() {
  const files = fs
    .readdirSync(CERT_PATH, { withFileTypes: true })
    .filter(item => item.isFile());
  const cert = files.find(file => file.name === 'cert.pem');
  const key = files.find(file => file.name === 'key.pem');

  return key && cert ? { key, cert } : {};
}

module.exports = Application;
