'use strict';

const path = require('path');
const importFiles = require('./importFiles');

const loadResource = (resourceName, application) => {
  const resourcePath = path.join(__dirname, '..', resourceName);

  const parts = importFiles(resourcePath);

  Object.keys(parts).forEach(partName => {
    const part = parts[partName];
    parts[partName] = part(application);
  });

  return parts;
};

module.exports = loadResource;
