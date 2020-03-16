const router = require("express").Router();
const routeCollectionHash = require("../routes");

Object.keys(routeCollectionHash).forEach(routeCollectionName => {
  const routeList = routeCollectionHash[routeCollectionName];

  routeList.forEach(route => {
    const path = `/${routeCollectionName}${route.path}`;
    const method = route.method.toLowerCase();
    router[method](path, route.handler);
  });
});

module.exports = router;
