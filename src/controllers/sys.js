const { sys: sysSrv } = require("../services");

/**
 * @api {get} / Say hello
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
async function sayHello(req, res, next) {
  const resData = { data: "" };
  // catch errors
  try {
    const result = await sysSrv.hello();
    // catch exceptions
    if (result instanceof Error) return res.status(418).send(result.message);

    resData.data = result;
    return res.status(200).json(resData);
  } catch (error) {
    return next(error);
  }
}

/**
 * @api {post} /echo Echo route
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
 *     "key": "value",
 *   }
 */
async function echo(req, res, next) {
  const resData = { data: undefined };
  // catch errors
  try {
    const result = await sysSrv.id(req.body);
    // catch exceptions
    if (result instanceof Error) return res.status(418).send(result.message);

    res.data = result;
    return res.json(resData);
  } catch (error) {
    return next(error);
  }
}

module.exports = { sayHello, echo };
