'use strict';

const fs = require('fs');
const path = require('path');
// eslint-disable-next-line
const chance = require('chance').Chance();
// eslint-disable-next-line
const config = require('../src/config');
const loadModuleSync = require('../src/sys/loadModuleSync');
const loadModule = require('../src/sys/loadModule');
const libs = require('../src/libs');
const constants = require('../src/consts');

const logger = console;
const timeout = (ms = 0) =>
  new Promise(resolve => setTimeout(() => resolve(), ms));

(async () => {
  const infrastructure = await loadModule('../src/infrastructure', {
    config: { ...config, APP: { IS_DEV: false } },
    libs,
    logger: console,
  });
  const domainModelsPath = libs.path.join(__dirname, '../src/domain-model');
  const domainModels = loadModuleSync(domainModelsPath, {
    infrastructure,
    libs,
    config,
    constants,
  });

  logger.time('Time spent');
  await main();
  logger.timeEnd('Time spent');


  async function main() {}

  process.exit(0);
})();

const fatal = err => {
  logger.timeEnd('Time spent');
  logger.error('Unhandled error\n', err);
  setTimeout(() => {
    process.exit(1);
  }, 10000);
};
process.on('uncaughtException', fatal);
process.on('unhandledRejection', fatal);
