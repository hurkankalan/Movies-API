const moviesRouter = require("./movies-routes");
const usersRoutes = require("../controllers/users-controllers");

const setupRoutes = (app) => {
  app.use("/api/movies", moviesRouter.moviesRouter);
  app.post("/api/users", usersRoutes.createOneUser);
  app.post("/api/auth/checkCredentials", usersRoutes.authControleUser);
};

module.exports = {
  setupRoutes,
};
