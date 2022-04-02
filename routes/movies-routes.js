const moviesControllers = require("../controllers/movies-controllers");
const moviesRouter = require("express").Router();

moviesRouter.get("/", moviesControllers.filterMoviesByColorAndDuration);

moviesRouter.post("/", moviesControllers.createMovies);

moviesRouter.get("/:id", moviesControllers.getOneMovie);

moviesRouter.delete("/:id", moviesControllers.deleteOneMovie);

module.exports = {
  moviesRouter,
};
