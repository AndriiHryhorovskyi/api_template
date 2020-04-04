const { importAll } = require("../lib");

const actors = importAll(__dirname);
const actorsNames = Object.keys(actors);
const actorsInstances = {};

Object.entries(actors).forEach(([key, value]) => {
  // eslint-disable-next-line
  actorsInstances[key] = value.instance;
});

const closeAllActors = () => {
  return Promise.allSettled(
    actorsNames.map(actorName => actors[actorName].close()), // eslint-disable-line
  );
};

module.exports = { ...actorsInstances, closeAllActors };
