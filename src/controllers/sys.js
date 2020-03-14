const { hello, id } = require("../BL");

function sayHello(req, res) {
  const result = hello();
  const data = { data: result };
  return res.status(200).json(data);
}

function echo(req, res) {
  const result = id(req.body);
  const data = { data: result };
  return res.json(data);
}

module.exports = { sayHello, echo };
