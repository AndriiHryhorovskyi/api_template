const router = require("express").Router();
const { importAll } = require("../lib");
const routeCollectionHash = require("../routes");

for (routeCollectionName in routeCollectionHash) {
  const routeCollection = routeCollectionHash[routeCollectionName];

  for (route of routeCollection) {
    const path = `/${routeCollectionName}${route.path}`;
    const method = route.method.toLowerCase();
    router[method](path, route.handler);
  }
}

module.exports = router;
