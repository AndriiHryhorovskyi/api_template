'use strict';

const fs = require('fs');
const path = require('path');

const importFiles = (dirPath, excluded = []) => {
  const files = {};
  fs.readdirSync(dirPath)
    .filter(
      file =>
        fs.statSync(path.join(dirPath, file)).isFile() &&
        path.extname(path.join(dirPath, file)) === '.js' &&
        file !== 'index.js' &&
        !file.startsWith('_') &&
        !excluded.includes(file),
    )
    .forEach(file => {
      const filename = path.basename(file, '.js');
      const filePath = path.join(dirPath, file);
      // eslint-disable-next-line
      files[filename] = require(filePath);
    });

  return files;
};

module.exports = importFiles;
