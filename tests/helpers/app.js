'use strict';

const app = require('superagent');
const {
  SERVER: { HOST, PORTS },
} = require('lib/config');

const PORT = PORTS[0];
const WEBHOST = `${HOST}:${PORT}`;
const httpMethods = ['get', 'post', 'options', 'patch', 'put', 'delete'];

const requestMethodsWrappers = {};

/* eslint-disable */
httpMethods.forEach(
  method =>
    (requestMethodsWrappers[method] = url =>
      app[method](`${WEBHOST}${url}`).ok(res => res.status < 600)),
);
/* eslint-enable */

module.exports = requestMethodsWrappers;
