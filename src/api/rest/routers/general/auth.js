'use strict';

module.exports = ({ useCases, useCaseRunner, middlewares, libs }) => {
  const router = libs.express.Router();

  /**
   * @api {get} /api/v1/auth/login Login
   * @apiVersion 1.0.0
   * @apiPermission public
   * @apiSampleRequest off
   *
   * @apiName Login
   * @apiGroup Auth
   * @apiDescription Generate access token
   *
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.accessToken
   * @apiSuccess {Object} meta
   * @apiSuccess {Number} meta.expiresIn Count of milliseconds to access token expiration
   *
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *    "data": {
   *      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDliNzgzNDU4MTlmYWVhMDZlZjYyMSIsImlhdCI6MTYyNDg4MTAyN30.p-lpTSRM6VJK-vmFmBtNdI-lFJbJjOeHTz_aiUyDt8A"
   *    },
   *    "meta": {
   *      "expiresIn": 60000
   *    }
   *  }
   */
  router.get(
    '/auth/login',
    useCaseRunner({
      UseCase: useCases.general.auth.Login,
    }),
  );

  /**
   * @api {get} /api/v1/auth/logout Logout
   * @apiPermission authenticated
   * @apiSampleRequest off
   *
   * @apiName Logout
   * @apiGroup Auth
   *
   * @apiParam (Headers) {String} Authorization Access token. Example: "Authorization": "Bearer <token>"
   *
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 204 OK
   *   {
   *    "data": null
   *  }
   * @apiUse 401
   */
  router.get(
    '/auth/logout',
    middlewares.checkSession,
    useCaseRunner({
      UseCase: useCases.general.auth.Logout,
      successStatus: 204,
    }),
  );

  return router;
};
