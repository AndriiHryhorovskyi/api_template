'use strict';

// eslint-disable-next-line
const userSrv = ({ dal, api }) => {
  const userList = async () => {
    const users = await dal.User.getAll();
    return users;
  };

  return { userList };
};

module.exports = userSrv;
