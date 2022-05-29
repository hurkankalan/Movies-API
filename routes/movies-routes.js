const moviesControllers = require("../controllers/movies-controllers");
const moviesRouter = require("express").Router();

moviesRouter.get("/:id", moviesControllers.getOneMovie);

moviesRouter.get("/", moviesControllers.filterMoviesByColorAndDuration);

moviesRouter.get("/user/:id", moviesControllers.AllMoviesCreatedByOneUser);

moviesRouter.post("/", moviesControllers.createMovies);

moviesRouter.put("/:id", moviesControllers.updateOneMovie);

moviesRouter.delete("/:id", moviesControllers.deleteOneMovie);

module.exports = {
  moviesRouter,
};
