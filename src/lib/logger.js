const pino = require("pino");

const logger =
  process.env.NODE_ENV === "production"
    ? pino()
    : pino({ prettyPrint: { colorize: true, translateTime: true } });

logger.uncaught = callback => pino.final(logger, callback);

module.exports = logger;
