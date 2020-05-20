'use strict';

const Application = require('./lib/application.js');

const application = new Application({ name: process.pid });

application.on('started', () => {
  application.logger.log(
    `Application started in worker ${application.worker.name}`,
  );
});

const lastLog = msg =>
  application.logger.uncaught((err, finalLogger) => {
    finalLogger.error(err, msg);
    process.exit(1);
  });

const sigint = async () => {
  // if app starts by npm it will send additional SIGINT event
  if (application.closing) return;

  application.logger.info(
    `Start graceful shutdown in worker ${application.worker.name}`,
  );
  await application.shutdown();
  application.logger.info(`Worker ${application.worker.name} exited`);
  process.exit(0);
};

process.on('uncaughtException', lastLog('uncaughtException'));
process.on('unhandledRejection', lastLog('unhandledRejection'));
process.on('SIGINT', sigint);
