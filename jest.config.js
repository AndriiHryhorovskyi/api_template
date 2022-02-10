'use strict';

module.exports = {
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src/', '<rootDir>/tests/'],
  setupFilesAfterEnv: ['./tests/initTestApp.js'],
};
