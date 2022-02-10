'use strict';

const path = require('path');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const MockAdapter = require('axios-mock-adapter');
const getPort = require('get-port');
const config = require('config');
const constants = require('consts');
const Application = require('sys/application');
const loadModule = require('sys/loadModule');
const loadModuleSync = require('sys/loadModuleSync');
const helpers = require('helpers');
const factories = require('factories');
const originalLibs = require('libs');
const initTestData = require('./stubs');

let mongod = null;

beforeAll(async () => {
  const port = await getPort();
  config.REST_API.SERVER.PORT = port;
  const mockedLibs = await mockLibs(originalLibs);
  const infrastructure = await mockInfrastructure({ libs: mockedLibs });
  const domainModels = await mockDomainModels({
    libs: mockedLibs,
    infrastructure,
  });
  const { useCases, useCaseInstances } = await mockUseCases({
    libs: mockedLibs,
    infrastructure,
    domainModels,
  });
  global.app = await runTestApp({
    libs: mockedLibs,
    constants,
    config,
    infrastructure,
    domainModels,
    useCases,
    useCaseInstances,
  });
  global.http = helpers.request(config);
  global.helpers = helpers;
  global.factories = factories;
});

afterAll(() => global.app.stop());

beforeEach(async () => {
  global.testData = await resetState(global.app.domainModels);
});

function resetState(models = {}) {
  return Promise.all(
    Object.values(models).map(model => model.deleteMany()),
  ).then(() => initTestData(models));
}

async function mockLibs(libs) {
  const axiosMock = new MockAdapter(libs.axios, {
    onNoMatch: 'throwException',
  });
  return Promise.resolve({ ...libs, axiosMock });
}

async function mockInfrastructure({ libs }) {
  mongod = await MongoMemoryReplSet.create({
    replSet: {
      storageEngine: 'wiredTiger',
    },
  });
  const URI = mongod.getUri();
  Object.assign(config, { MONGO: { ...config.MONGO, URI, POOL_SIZE: 1 } });
  const infrastructure = await loadModule('infrastructure', {
    libs,
    config,
    logger: new libs.Logger({ config }),
  });
  return infrastructure;
}

async function mockDomainModels({ libs, infrastructure }) {
  const domainModelsPath = path.join(__dirname, '../src/domain-model');
  const models = loadModuleSync(domainModelsPath, {
    infrastructure,
    libs,
    constants,
    config,
  });
  // TODO: spy all domainModels calls
  Object.entries(models).forEach(([, model]) => {
    Object.entries(model.schema.statics).forEach(([methodName, method]) => {
      // eslint-disable-next-line
      model[methodName] = jest.fn(function (...args) {
        return method.bind(model)(...args);
      });
    });
  });
  return Promise.resolve(models);
}

async function mockUseCases({ libs, infrastructure, domainModels }) {
  const useCasesPath = path.join(__dirname, '../src/use-cases');
  const useCases = loadModuleSync(useCasesPath, {
    domainModels,
    libs,
    infrastructure,
    config,
    constants,
    logger: new libs.Logger({ config }),
  });
  const mockSectionEntities = (section, useCaseInstances = {}) => {
    const mockedUseCases = {};
    Object.entries(section).forEach(([entityName, Entity]) => {
      if (typeof Entity === 'object') {
        Object.assign(useCaseInstances, { [entityName]: {} });
        const result = mockSectionEntities(
          Entity,
          useCaseInstances[entityName],
        );
        Object.assign(mockedUseCases, { [entityName]: result });
      } else {
        mockedUseCases[entityName] = jest.fn((...args) => {
          const entity = new Entity(...args);
          const originalExecute = entity.execute;
          const mockedExecute = jest.fn((...params) =>
            originalExecute.bind(entity)(...params),
          );
          entity.execute = mockedExecute;
          Object.assign(useCaseInstances, {
            [`${entityName[0].toLowerCase() + entityName.slice(1)}`]: {
              execute: mockedExecute,
            },
          });
          return entity;
        });
      }
    });
    return mockedUseCases;
  };
  const useCaseInstances = {};
  const mockedUseCases = mockSectionEntities(useCases, useCaseInstances);
  return Promise.resolve({
    useCases: mockedUseCases,
    useCaseInstances,
  });
}

function runTestApp(mockedResources = {}) {
  return new Promise(resolve => {
    const application = new Application(mockedResources);
    application.on('started', () => {
      application.stop = () => application.shutdown().then(() => mongod.stop());
      application.resetState = resetState.bind(null, application.domainModels);
      return resolve(application);
    });
  });
}
