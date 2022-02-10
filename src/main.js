'use strict';

const Application = require('./sys/application');

const application = new Application();

application.on('started', () => {
  application.logger.info('Application started');
});

const lastLog = msg =>
  application.logger.uncaught((err, finalLogger) => {
    finalLogger.fatal(err, msg);
    process.exit(1);
  });

const shutdown = async signal => {
  application.logger.info(`${signal} signal catched`);
  // if app starts by npm it will send additional SIGINT event
  if (application.closing) return;
  application.logger.info('Start graceful shutdown');
  await application.shutdown();
  application.logger.info('Application stopped');
  process.exit(0);
};

process.on('uncaughtException', lastLog('uncaughtException'));
process.on('unhandledRejection', lastLog('unhandledRejection'));
process.on('SIGINT', shutdown.bind('SIGINT'));
process.on('SIGTERM', shutdown.bind('SIGTERM'));
