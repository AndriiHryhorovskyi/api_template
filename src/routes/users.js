'use strict';

module.exports = ({ ctrls }) => [
  {
    method: 'GET',
    path: '/api/users/list',
    handler: ctrls.user.userList,
  },
];
