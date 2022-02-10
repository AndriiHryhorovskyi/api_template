'use strict';

const getAuthHeader = accessToken => ({
  headerName: 'Authorization',
  headerValue: `Bearer ${accessToken}`,
});

module.exports = getAuthHeader;
