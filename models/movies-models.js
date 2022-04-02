const db = require("../config/db_config");

const findManyMovies = (color, max_duration) => {
  let sql = "SELECT * FROM movies ";
  let sqlValues = [];
  if (max_duration && color) {
    sql += `WHERE duration <= ${max_duration} AND color = ${color}`;
    sqlValues.push(sql);
  } else if (max_duration) {
    sql += `WHERE duration <= ${max_duration}`;
    sqlValues.push(sql);
  } else if (color) {
    sql += `WHERE color <= ${color}`;
    sqlValues.push(sql);
  }
  return db
    .promise()
    .query(sql, sqlValues)
    .then((result) => {
      return result;
    });
};

const createMovies = (title, director, year, color, duration) => {
  let sqlRequest = `INSERT INTO movies(title, director, year, color, duration) VALUES('${title}', '${director}', '${year}', ${color}, ${duration})`;
  return db
    .promise()
    .query(sqlRequest)
    .then((result) => {
      return result;
    });
};

const findOneMovie = (id) => {
  let request = `SELECT * FROM movies WHERE id = ${id}`;
  return db
    .promise()
    .query(request)
    .then((result) => {
      return result;
    });
};

const deleteMovie = (id) => {
  let sql = `DELETE FROM movies WHERE id = ${id}`;
  return db
    .promise()
    .query(sql)
    .then((result) => {
      return result;
    });
};

const updateMovie = (id) => {
  let sqlRequest = `UPDATE movies SET ? WHERE id = ${id}`;
  return db
    .promise()
    .query(sqlRequest)
    .then((result) => {
      return result;
    });
};

module.exports = {
  findManyMovies,
  createMovies,
  findOneMovie,
  deleteMovie,
  updateMovie,
};
