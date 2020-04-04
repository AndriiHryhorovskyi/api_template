const { logger } = require("../lib");

const instance = { name: "sample" };
const close = () => {
  logger.info("Sample actor is closed");
  return Promise.resolve();
};

module.exports = {
  instance,
  close,
};
