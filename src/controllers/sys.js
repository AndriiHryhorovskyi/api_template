const { hello, id } = require("../BL");

async function sayHello(req, res, next) {
  const data = { data: "" };
  // catch errors
  try {
    const result = await hello();
    // catch exceptions
    if (result instanceof Error) return res.status(418).send(result.message);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function echo(req, res, next) {
  const data = { data: undefined };
  // catch errors
  try {
    const result = await id(req.body);
    // catch exceptions
    if (result instanceof Error) return res.status(418).send(result.message);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

module.exports = { sayHello, echo };
