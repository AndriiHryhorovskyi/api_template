const { OK, I_AM_A_TEATPOT } = require("http-status-codes");
const { sys: sysSrv } = require("../services");
const { errorBody } = require("../lib");

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
async function sayHello(req, res, next) {
  const resData = { data: "" };
  // catch errors
  try {
    const [err, result] = await sysSrv.hello();
    // catch exceptions
    if (err) {
      const errData = errorBody(result.message);
      res.status(I_AM_A_TEATPOT).json(errData);
      return;
    }
    resData.data = result;
    res.status(OK).json(resData);
  } catch (error) {
    next(error);
  }
}

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
async function echo(req, res, next) {
  const resData = { data: undefined };
  // catch errors
  try {
    const [err, result] = await sysSrv.id(req.body);
    // catch exceptions
    if (err) {
      const errData = errorBody(result.message);
      res.status(I_AM_A_TEATPOT).json(errData);
      return;
    }

    resData.data = result;
    res.json(resData);
  } catch (error) {
    next(error);
  }
}

module.exports = { sayHello, echo };
