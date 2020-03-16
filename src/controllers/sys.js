const { hello, id } = require("../BL");

async function sayHello(req, res, next) {
  const resData = { data: "" };
  // catch errors
  try {
    const result = await hello();
    // catch exceptions
    if (result instanceof Error) return res.status(418).send(result.message);

    resData.data = result;
    return res.status(200).json(resData);
  } catch (error) {
    return next(error);
  }
}

async function echo(req, res, next) {
  const resData = { data: undefined };
  // catch errors
  try {
    const result = await id(req.body);
    // catch exceptions
    if (result instanceof Error) return res.status(418).send(result.message);

    res.data = result;
    return res.json(resData);
  } catch (error) {
    return next(error);
  }
}

module.exports = { sayHello, echo };
