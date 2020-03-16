const { importAll } = require("../lib");

const actors = importAll(__dirname);
const actorsNames = Object.keys(actors);

const actorsInstances = Object.entries(actors).reduce(
  (obj, [key, value]) => ((obj[key] = value.instance), obj),
  {},
);

const closeAllActors = () =>
  Promise.allSettled(actorsNames.map(actorName => actors[actorName].close()));

module.exports = { ...actorsInstances, closeAllActors };
