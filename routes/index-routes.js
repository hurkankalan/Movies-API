const moviesRouter = require("./movies-routes");
const usersRoutes = require("../controllers/users-controllers");

const setupRoutes = (app) => {
  app.use("/api/movies", moviesRouter.moviesRouter);
  app.get("/api/users", usersRoutes.createOneUser);
};

module.exports = {
  setupRoutes,
};
