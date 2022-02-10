'use strict';

module.exports =
  ({ errors }) =>
  ({ UseCase, successStatus = 200, customHandler }) =>
  async (req, res, next) => {
    try {
      const context = req.session ?? {};
      const { query = {}, params = {}, body = {} } = req;
      const service = new UseCase({ context });
      const result = await service.run({ ...query, ...params, ...body });
      const defaultHandler = data => res.status(successStatus).json(data);
      const resultHandler = customHandler || defaultHandler;
      return resultHandler(result);
    } catch (error) {
      if (error instanceof errors.Exception) {
        const { httpStatus, ...errorInfo } = error;
        return res.status(httpStatus).json({ error: errorInfo });
      }
      return next(error);
    }
  };
