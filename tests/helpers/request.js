'use strict';

const app = require('superagent');

module.exports = config => {
  const {
    REST_API: {
      SERVER: { HOST, PORT },
    },
  } = config;

  const WEBHOST = `${HOST}:${PORT}`;
  const httpMethods = ['get', 'post', 'options', 'patch', 'put', 'delete'];

  const wrappedRequestMethods = {};

  /* eslint-disable */
  httpMethods.forEach(
    method =>
      (wrappedRequestMethods[method] = url =>
        app[method](`${WEBHOST}${url}`).ok(res => res.status < 600)),
  );
  /* eslint-enable */

  /*
   * {
   *  get: (url) => {...},
   *  post: (url) => {...},
   *  ...
   * }
   */
  return wrappedRequestMethods;
};
