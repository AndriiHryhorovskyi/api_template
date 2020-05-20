'use strict';

module.exports = ({ ctrls }) => [
  {
    method: 'GET',
    path: /^\/(?!api\b)/,
    handler: ctrls.static.serveFiles,
  },
];
