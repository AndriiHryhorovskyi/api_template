'use strict';

module.exports = ({ libs }) => {
  const { cors, jwt } = libs;

  const getBody = libs.express.json();

  const checkSession = async (req, res, next) => {
    const authLine = req.headers.authorization;
    if (!authLine) return res.sendStatus(401);
    const [schema, token] = authLine.split(' ');
    if (schema.toLowerCase() !== 'bearer' || !token) return res.sendStatus(401);
    const tokenData = await jwt.accessToken.verify(token).catch(() => null);
    if (!tokenData) return res.sendStatus(401);
    req.session = { session: tokenData };
    return next();
  };

  const checkRole = role => async (req, res, next) => {
    await checkSession(req, res, () => {});
    if (req?.session?.session?.role !== role) {
      return res.headersSent || res.sendStatus(403);
    }
    return next();
  };

  return {
    cors: cors({ origin: '*' }),
    getBody,
    checkRole,
    checkSession,
  };
};
