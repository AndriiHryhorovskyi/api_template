'use strict';

// eslint-disable-next-line
const sysSrv = ({ dal, api }) => {
  const hello = async () => [null, 'Hi'];
  const id = async data => [null, data];

  return { hello, id };
};

module.exports = sysSrv;
