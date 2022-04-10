const db = require("../config/db_config");
const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOptions);
};

const verifyPassword = (hashedPassword, plainPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

const findOneUser = (email) => {
  let request = `SELECT * FROM users WHERE email = '${email}'`;
  return db
    .promise()
    .query(request)
    .then((result) => result);
};

const authControle = async (email, password) => {
  let request = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  return await db.promise().query(request);
};

const getPassword = async (email, password) => {
  let request = `SELECT password FROM users WHERE email = '${email}' AND password = ${password}`;
  return await db.promise().query(request);
};

const createUsers = (
  firstname,
  lastname,
  email,
  hashedPassword,
  city,
  language
) => {
  let request = `INSERT INTO users(firstname, lastname, email, password, city, language) VALUES ('${firstname}', '${lastname}', '${email}', '${hashedPassword}', '${city}', '${language}')`;
  return db
    .promise()
    .query(request)
    .then((result) => result);
};

module.exports = {
  findOneUser,
  createUsers,
  hashPassword,
  verifyPassword,
  authControle,
  getPassword,
};
