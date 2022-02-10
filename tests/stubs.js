'use strict';

const factories = require('factories');
const { getAuthHeader, createUserToken } = require('helpers');

module.exports = async ({ User, RefreshToken }) => {
  const testUser = factories.user();
  const userRt = factories.refreshToken({ userId: testUser.id });
  const userAccessToken = createUserToken({ id: testUser.id });
  testUser.auth = {
    accessToken: userAccessToken,
    refreshToken: userRt.token,
    ...getAuthHeader(userAccessToken),
  };
  await Promise.all([User.create([testUser]), RefreshToken.create([userRt])]);
  return {
    users: {
      user: testUser,
      list: [testUser],
    },
  };
};
