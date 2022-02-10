'use strict';

module.exports = ({ libs }) => {
  const router = libs.express.Router();

  /**
   * @api {get} /api/v1/sys/healthcheck Healthcheck
   * @apiPermission public
   * @apiSampleRequest off
   *
   * @apiName GetStore
   * @apiGroup Sys
   * @apiDescription Check if http server is up
   *
   * @apiSuccessExample {} Success-Response:
   *   HTTP/1.1 200 OK
   */
  router.get('/sys/healthcheck', (req, res) => res.status(200).send());

  return router;
};
