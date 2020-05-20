// eslint-disable-next-line
const User = ({ db, api, logger }) => {
  const getAll = async () => [{ name: 'testUser' }];

  return { getAll };
};

module.exports = User;
