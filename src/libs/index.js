'use strict';

const importFiles = require('../sys/importFiles');

const customLibs = importFiles(__dirname);
const libs = [
  'http',
  'https',
  'crypto',
  'path',
  'express',
  'mongoose',
  'mongoose-lean-virtuals',
  'joi',
  'cors',
  'axios',
  './validator',
];

// eslint-disable-next-line
for (const libName of libs) {
  // eslint-disable-next-line
  customLibs[libName] = Object.freeze(require(libName));
}

customLibs.mongooseLeanVirtuals = customLibs['mongoose-lean-virtuals'];

module.exports = Object.freeze(customLibs);
