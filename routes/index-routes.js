const moviesRouter = require("./movies-routes");

const setupRoutes = (app) => {
  app.use("/api/movies", moviesRouter.moviesRouter);
};

module.exports = {
  setupRoutes,
};
