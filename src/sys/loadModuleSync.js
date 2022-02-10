'use strict';

const importFiles = require('./importFiles');

/**
 * Synchronously load an application module. It uses importFiles
 * @see importFiles
 * @param {Object} resources - Application resources
 * @param {String} modulePath - Path to module
 * @return {Object} Loaded module files
 * @example <caption>Returned object</caption>
 * { fileName: content } // content - exported function result
 */
const loadModule = (modulePath, resources) => {
  const files = importFiles(modulePath, Number.MAX_SAFE_INTEGER);
  return initSection(files, resources);
};

function initSection(section, resources) {
  Object.keys(section).forEach(sectionName => {
    if (typeof section[sectionName] === 'object') {
      initSection(section[sectionName], resources);
    } else {
      // eslint-disable-next-line
      section[sectionName] = section[sectionName](resources);
    }
  });
  return section;
}

module.exports = loadModule;
