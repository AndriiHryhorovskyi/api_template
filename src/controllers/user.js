'use strict';

// eslint-disable-next-line
const userCtrl = ({ api, cache, logger, services }) => {
  const userList = async client => {
    const users = await services.User.userList();
    client.success({ data: users });
  };

  return { userList };
};

module.exports = userCtrl;
