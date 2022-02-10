'use strict';

const { ROLES } = require('consts');
const { jwt } = require('libs');

module.exports = ({ id, role = ROLES.user, ...payload }, options = {}) =>
  jwt.accessToken.issueTokenSync(
    {
      id,
      role,
      ...payload,
    },
    options,
  );
