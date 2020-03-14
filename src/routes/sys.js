const { sys } = require("../controllers");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: sys.sayHello,
  },
  {
    method: "GET",
    path: "/echo",
    handler: sys.echo,
  },
];
