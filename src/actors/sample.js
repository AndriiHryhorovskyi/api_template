const { logger } = require("../lib");

module.exports = {
  instance: { name: "sample" },
  close: async () => {
    logger.info("Sample actor is closed");
  },
};
