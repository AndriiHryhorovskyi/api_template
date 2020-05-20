'use strict';

// eslint-disable-next-line
const sysCtrl = ({ api, cache, logger, services }) => {
  const { Sys: sysSrv } = services;

  /**
   * @api {get} /api/sys/ Say hello
   * @apiPermission none
   *
   * @apiName sayHello
   * @apiGroup Sys
   * @apiDescription route for test
   *
   * @apiSuccess {String} data Test response
   *
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "data": "Hi",
   *   }
   */
  const sayHello = async client => {
    const [err, result] = await sysSrv.hello();
    if (err) {
      client.error(418, result.message);
      return;
    }
    client.success({ data: result });
  };

  /**
   * @api {post} /api/sys/echo Echo route
   * @apiPermission none
   *
   * @apiName echo
   * @apiGroup Sys
   * @apiDescription return data from request body
   *
   * @apiSuccess {String} data Test response
   *
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "data": value,
   *   }
   */
  const echo = async client => {
    const body = await client.getPayload();
    const { schemas, validate } = api.validator;
    const [validErr, validData] = await validate(schemas.echo, body);
    if (validErr) {
      client.error(400, validErr.message);
      return;
    }

    const [srvErr, result] = await sysSrv.id(validData);
    if (srvErr) {
      client.error(418, srvErr.message);
      return;
    }

    client.success({ data: result });
  };

  return { sayHello, echo };
};

module.exports = sysCtrl;
