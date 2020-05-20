'use strict';

const router = require('express').Router();

const getRouter = routeSections => {
  Object.values(routeSections).forEach(routeList => {
    routeList.forEach(route => {
      const method = route.method.toLowerCase();
      router[method](route.path, async (req, res, next) => {
        try {
          await route.handler(req.client);
        } catch (error) {
          next(error);
        }
      });
    });
  });
  return router;
};
module.exports = getRouter;
