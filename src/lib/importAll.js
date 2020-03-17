const fs = require("fs");
const path = require("path");

function importAll(dirPath, excluded = []) {
  const files = {};

  // eslint-disable-next-line
  fs.readdirSync(dirPath)
    .filter(
      file =>
        fs.statSync(path.join(dirPath, file)).isFile() && // eslint-disable-line
        path.extname(path.join(dirPath, file)) === ".js" &&
        file !== "index.js" &&
        !excluded.includes(file),
    )
    .forEach(file => {
      const filename = path.basename(file, ".js");
      const filePath = path.join(dirPath, file);
      // eslint-disable-next-line
      files[filename] = require(filePath);
    });

  return files;
}

module.exports = importAll;
