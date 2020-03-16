const { importAll } = require("../lib");

const actors = importAll(__dirname);
const actorsNames = Object.keys(actors);

const actorsInstances = {};
Object.entries(actors).forEach(([key, value]) => {
  actorsInstances[key] = value.instance;
});

const closeAllActors = () =>
  Promise.allSettled(actorsNames.map(actorName => actors[actorName].close()));

module.exports = { ...actorsInstances, closeAllActors };
