const moviesModels = require("../models/movies-models");
const usersModels = require("../models/users-models");

const AllMoviesCreatedByOneUser = async (req, res) => {
  try {
    const userId = await usersModels.decodeUserFromJWT(req.headers.cookie.slice(11)).userId;
    console.log(userId);
    const allMovies = await moviesModels.findAllMoviesCreatedByOneUser(userId);
    res.status(200).send(allMovies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving movies");
  }
};

const filterMoviesByColorAndDuration = (req, res) => {
  const { color, max_duration } = req.query;
  moviesModels
    .findManyMovies(color, max_duration)
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((error) => {
      res
        .status(500)
        .send(
          `Error retrieving movies from database. The error message is : ${error.message}`
        );
    });
};

const createMovies = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  moviesModels
    .createMovies(title, director, year, color, duration)
    .then((result) => {
      const id = result.insertId;
      const createdMovies = { id, ...req.body };
      res.status(201).json(createdMovies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error saving the movie to database");
    });
};

const getOneMovie = (req, res) => {
  const movieId = req.params.id;
  moviesModels
    .findOneMovie(movieId)
    .then((result) => res.status(200).json(result[0]))
    .catch((error) => {
      console.error(error);
      if (result[0] === undefined || result.length === 0) {
        res.status(404).send("Movie not found");
      } else {
        res.status(500).send(`Error get the movie...`);
      }
    });
};

const deleteOneMovie = (req, res) => {
  const movieId = req.params.id;
  moviesModels
    .deleteMovie(movieId)
    .then((result) => res.sendStatus(204))
    .catch((e) => res.status(500).send("Error deleting the movie"));
};

const updateOneMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  const movieId = req.params.id;
  moviesModels
    .findOneMovie(movieId)
    .then(([result]) => {
      if (!result[0]) return Promise.reject("FILM_NOT_FOUND");
      else
        return moviesModels.updateMovie(
          title,
          director,
          year,
          color,
          duration,
          movieId
        );
    })
    .then((result) => {
      res.status(201).json({ ...req.body });
    })
    .catch((error) => {
      console.log(error);
      if (error === "FILM_NOT_FOUND")
        res.status(404).send(`Movie with id ${movieId} is not found.`);
      else {
        res.status(500).send("Error saving the movie on database.");
      }
    });
};

module.exports = {
  filterMoviesByColorAndDuration,
  createMovies,
  getOneMovie,
  deleteOneMovie,
  updateOneMovie,
  AllMoviesCreatedByOneUser,
};
