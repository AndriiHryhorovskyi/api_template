'use strict';

const path = require('path');
const importFiles = require('./importFiles');

/**
 * Asynchronously load the application module. It uses importFiles
 * @see importFiles
 * @param {String} moduleName - Module name
 * @param {Object} params - Module params
 * @return {Promise<Object>} Loaded modules files
 * @example <caption>Returned object</caption>
 * { fileName: content } // content - result of `require`
 */
const loadModule = async (moduleName, params) => {
  const modulePath = path.join(__dirname, '..', moduleName);
  const parts = importFiles(modulePath);
  return Object.keys(parts).reduce(async (prev, partName) => {
    const accum = await prev;
    const part = parts[partName];
    return Object.assign(accum, { [partName]: await part(params) });
  }, Promise.resolve({}));
};

module.exports = loadModule;
