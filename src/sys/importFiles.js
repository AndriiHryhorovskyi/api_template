'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Recursively loads .js files from folder. index.js and files that starts with _ will be ignored
 * @param {String} dirPath - Path to folder
 * @param {Number} lvl - Nesting level
 * @param {String[]} exluded - List of files that should not be loaded
 * @return {Object} loaded files
 * @example <caption>Returned object</caption>
 * { fileName: content } // content - result of `require`
 */

const importFiles = (dirPath, lvl = 0, excluded = []) => {
  const files = {};
  fs.readdirSync(dirPath).forEach(file => {
    if (!fs.statSync(path.join(dirPath, file)).isFile() && lvl > 0) {
      const fileList = importFiles(path.join(dirPath, file), lvl - 1, excluded);
      Object.assign(files, { [file]: fileList });
    } else if (
      path.extname(path.join(dirPath, file)) === '.js' &&
      file !== 'index.js' &&
      !file.startsWith('_') &&
      !excluded.includes(file)
    ) {
      const filename = file.split('.')[0];
      const filePath = path.join(dirPath, file);
      // eslint-disable-next-line
      files[filename] = require(filePath);
    }
  });

  return files;
};

module.exports = importFiles;
