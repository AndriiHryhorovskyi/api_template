'use strict';

module.exports = ({ ctrls }) => [
  {
    method: 'GET',
    path: '/api/sys',
    handler: ctrls.sys.sayHello,
  },
  {
    method: 'GET',
    path: '/api/sys/echo',
    handler: ctrls.sys.echo,
  },
];
