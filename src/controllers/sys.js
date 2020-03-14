const { hello, id } = require("../BL");

async function sayHello(req, res) {
  const result = await hello();
  const data = { data: result };
  return res.status(200).json(data);
}

async function echo(req, res) {
  const result = await id(req.body);
  const data = { data: result };
  return res.json(data);
}

module.exports = { sayHello, echo };
