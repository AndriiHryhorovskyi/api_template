const http = require("http");
const { PORT } = require("../config");
const requestHandler = require("../framework");
const { logger } = require("../actors");

const server = http
  .createServer(requestHandler)
  .listen(PORT)
  .on("error", onError)
  .on("listening", onListening);

process.on("SIGINT", () => {
  logger.info("Stopping server");

  server.close(() => {
    logger.info("Server stopped");
    process.exit(0);
  });
});

process.on("unhandledRejection", logger.error);

process.on("uncaughtException", logger.error);

function onError(err) {
  if (err.syscall !== "listen") {
    throw err;
  }

  const bind = typeof port === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  const errCodeStrategies = {
    EACCES() {
      logger.error(`${bind} requires elevated privileges`);
    },
    EADDRINUSE() {
      logger.error(`${bind} is already in use`);
    },
  };

  if (!(err.code in errCodeStrategies)) throw err;

  errCodeStratagies[err.code]();
  process.exit(1);
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
}
