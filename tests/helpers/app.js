const app = require("superagent");
const { WEBHOST } = require("config");

const httpMethods = ["get", "post", "options", "patch", "put", "delete"];

const requestMethodsWrappers = {};

/* eslint-disable */
httpMethods.forEach(
  method =>
    (requestMethodsWrappers[method] = url => app[method](`${WEBHOST}${url}`)),
);
/* eslint-enable */

module.exports = requestMethodsWrappers;
