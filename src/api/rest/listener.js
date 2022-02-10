'use strict';

const getMiddlewares = require('./middlewares');
const makeUseCaseRuner = require('./useCaseRunner');

const NS_PER_MS = BigInt(1e6);

module.exports = ({ clients, config, libs, useCases, constants, logger }) => {
  const { LONG_RESPONSE } = config.REST_API.SERVER;
  const { errors } = libs;
  const middlewares = getMiddlewares({ libs, config });
  const routersPath = libs.path.join(__dirname, 'routers');
  const routers = libs.loadModuleSync(routersPath, {
    useCases,
    useCaseRunner: makeUseCaseRuner({ errors }),
    middlewares,
    libs,
    constants,
  });
  const app = libs.express();

  app.disable('x-powered-by');
  app.set('trust proxy', true);

  app.use((req, res, next) => {
    res.set('Cache-Control', 'private, no-cache, no-store');
    const traceId = Date.now();
    req.traceId = traceId;
    req.arrivalTime = process.hrtime.bigint();
    clients.set(req, res);
    const { method, url, headers, socket } = req;
    const reqInfo = {
      traceId,
      method,
      url,
      headers,
      ip: socket.remoteAddress,
      port: socket.remotePort,
    };
    const timer = setTimeout(() => {
      if (res.writableEnded) return;
      const err = {
        status: 504,
        message: 'Time is out',
        description: 'Request terminated. Too long processing',
      };
      next(err);
    }, LONG_RESPONSE);
    res.on('finish', () => {
      const timeDiff = process.hrtime.bigint() - req.arrivalTime;
      const responseTime = (timeDiff / NS_PER_MS).toString();
      const { statusCode } = res;
      logger.info(
        {
          req: reqInfo,
          res: { responseTime, statusCode },
        },
        'Request complited',
      );
    });
    res.on('close', () => {
      clearTimeout(timer);
      clients.delete(req);
    });
    next();
  });

  app.use(middlewares.cors);

  Object.entries(routers).forEach(([zoneName, zone]) => {
    const path = `/api/v1${zoneName === 'general' ? '' : `/${zoneName}`}`;
    Object.entries(zone).forEach(([, router]) => app.use(path, router));
  });

  app.use((req, res) =>
    res.status(404).json({
      error: { message: 'Not found', description: 'The route not found' },
    }),
  );

  // eslint-disable-next-line
  app.use((err, req, res, next) => {
    const { method, url, headers, socket } = req;
    const reqInfo = {
      traceId: req.traceId,
      method,
      url,
      headers,
      body: req.body,
      ip: socket.remoteAddress,
      port: socket.remotePort,
    };
    const status = err.status ?? 500;
    const logLvl = status === 500 ? 'fatal' : 'warn';
    logger[logLvl]({
      error: { message: err.message, stack: err.stack },
      request: reqInfo,
    });
    res.status(500).json({
      error: {
        message: 'Internal server error',
        description: 'Unhandled behaviour',
      },
    });
  });
  return app;
};
