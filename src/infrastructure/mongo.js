'use strict';

/** Establish connection to mongoDB
 * @param {Object} params - params
 * @param {Object} params.config - config
 * @param {Object} params.logger - application logger
 * @return {Promise} mongodb connection
 */
const getConnection = ({ libs, config, logger }) => {
  const { mongoose } = libs;
  const { MONGO, APP } = config;
  const { IS_DEV } = APP;
  const { POOL_SIZE, CONNECTION_TIMEOUT, URI } = MONGO;

  return new Promise((resolve, reject) => {
    if (IS_DEV) mongoose.set('debug', true);

    const { connection } = mongoose;
    try {
      mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        poolSize: POOL_SIZE,
        serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
      });
    } catch (err) {
      logger.error('Mongoose connection failed');
      reject(err);
    }

    connection.on('connected', () => {
      logger.info(`MongoDB connection established`);
      resolve(connection);
    });

    connection.on('reconnected', () => {
      logger.info('MnogoDB reconnected succesfully');
    });

    connection.on('disconnected', () => {
      logger.info('Mongoose connection is closed');
    });

    connection.on('reconnectFailed', () => {
      logger.info('MongoDB reconnection failed');
    });

    connection.on('error', err => {
      logger.error(err, 'Mongoose connectinon error');
      return mongoose.disconnect();
    });
  });
};

module.exports = getConnection;
