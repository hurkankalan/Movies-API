const db = require("../config/db_config");

const findOneUser = (email) => {
  let request = `SELECT * FROM users WHERE email = '${email}'`;
  return db
    .promise()
    .query(request)
    .then((result) => result);
};

const createUsers = (firstname, lastname, email, city, language) => {
  let request = `INSERT INTO users(firstname, lastname, email, city, language) VALUES ('${firstname}', '${lastname}', '${email}', '${city}', '${language}')`;
  return db
    .promise()
    .query(request)
    .then((result) => result);
};

module.exports = { findOneUser, createUsers };
