'use strict';

const { EventEmitter } = require('events');

const appConfig = require('../config');
const appLibs = require('../libs');
const loadModule = require('./loadModule');
const loadModuleSync = require('./loadModuleSync');
const appConstants = require('../consts');
const RestApi = require('../api/rest/server');
const configSchema = require('../config/schema');

/**
 * Creates a new Application
 * @class
 * @classdesc This initializes modules, such as server or data sources, and join them into the application
 * @extends EventEmitter
 * @param {Object} [options] - application options
 * @param {Object} [options.libs] - appclication config
 * @param {Object} [options.config] - application config
 * @param  {Object} [options.constants] - application constants
 * @param {Object} [options.logger] - application logger
 * @param {Object} [options.domainModels]
 * @param {Object} [options.useCases]
 * @param {Object} [options.restApi] - rest api implementation
 * @fires Application#started
 * @prop {Boolean} closing - Indicates if application closing
 * @prop {Object} libs - Application libs
 * @prop {Object} config - Application config
 * @prop {Object} constants - Application constants
 * @prop {Object} logger - Application logger
 * @prop {Object} infrastructure - Connections with other services like database or else
 * @prop {Object} domainModels
 * @prop {Object} useCases
 * @prop {Object} restApi - rest api instance
 */
class Application extends EventEmitter {
  constructor({
    libs,
    constants,
    config,
    logger,
    infrastructure,
    domainModels,
    useCases,
    restApi,
    ...otherParams
  } = {}) {
    super();
    this.closing = false;
    this.libs = libs ?? appLibs;
    this.constants = constants ?? appConstants;
    this.config = config ?? appConfig;
    this.logger = logger ?? new this.libs.Logger({ config: this.config });
    this.libs.validator
      .validateConfig(configSchema, this.config)
      .catch(error => this.logger.error(error, 'Invalid application config'))
      .then(
        () =>
          infrastructure ??
          loadModule('infrastructure', {
            libs: this.libs,
            config: this.config,
            logger: this.logger,
          }),
      )
      .then(loadedInfrastructure => {
        this.infrastructure = loadedInfrastructure;
        const domainModelsPath = this.libs.path.join(
          __dirname,
          '../domain-model',
        );
        const useCasesPath = this.libs.path.join(__dirname, '../use-cases');
        this.domainModels =
          domainModels ??
          loadModuleSync(domainModelsPath, {
            infrastructure: this.infrastructure,
            libs: this.libs,
            constants: this.constants,
            config: this.config,
            logger: this.logger,
          });
        this.useCases =
          useCases ??
          loadModuleSync(useCasesPath, {
            domainModels: this.domainModels,
            libs: this.libs,
            infrastructure: this.infrastructure,
            config: this.config,
            constants: this.constants,
            logger: this.logger,
          });
        Object.entries(otherParams).forEach(([param, value]) => {
          this[param] = value;
        });
        this.restApi =
          restApi ??
          new RestApi({
            config: this.config,
            useCases: this.useCases,
            libs: { ...this.libs, loadModuleSync },
            constants: this.constants,
            logger: this.logger,
          });
        this.restApi.start();
      })
      .then(() => {
        /**
         * Indicates the application successfully initialized and ready to use
         * @event Application#started
         */
        this.emit('started');
      });
  }

  /**
   * Initiates shutdown the application
   */
  async shutdown() {
    this.closing = true;
    await this.restApi.stop();
    await this.freeResources();
  }

  /**
   * Frees the allocated resources
   */
  async freeResources() {
    this.logger.info('Free resources');
    // await Promise.all([this.infrastructure.map(item => item.close())]);
    await this.infrastructure.mongo.close();
  }
}

module.exports = Application;
