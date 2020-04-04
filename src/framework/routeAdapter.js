const router = require("express").Router();
const routeCollectionHash = require("../routes");

Object.keys(routeCollectionHash).forEach(routeCollectionName => {
  // eslint-disable-next-line
  const routeList = routeCollectionHash[routeCollectionName];

  routeList.forEach(route => {
    const path = `/api/${routeCollectionName}${route.path}`;
    const method = route.method.toLowerCase();
    // eslint-disable-next-line
    router[method](path, route.handler);
  });
});

module.exports = router;
