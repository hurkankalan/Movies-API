const db = require("../config/db_config");
const argon2 = require("argon2");
const Crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * Argon : permet de hashé de la data
 */
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
}; // Les différents options de hashing

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOptions);
}; // return un mot de passe, mais hashé (crypté).

const verifyPassword = (hashedPassword, plainPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions);
}; // return true si le passwork hashé correspond au password de la BDD saisie par l'user. Si non, return false.

/**
 * Crypto : pour crypé de la data et créer un token de facon simple
 */
const PRIVATE_KEY = process.env.PRIVATE_KEY; // On définit une clé privée qui doit être dans un fichier .env et importée en utilisant un gestionnaire d'environnement (comme dotenv dans notre cas).

const calculateToken = (userEmail) => {
  return Crypto.createHash("md5")
    .update(userEmail + PRIVATE_KEY)
    .digest("hex");
}; // Je dis à Node que je veux utiliser un algorithme de hachage md5, puis je procéde au mélange de la clé privée avec l'email de l'utilisateur. Le résultat de ce hash sera converti en caractères hexadécimaux (on peut utiliser une autre transformation, comme base64 par exemple).

// On met de coté l'ancienne fonction de generation de token, maintenant on utilise crypto avec jwt token !
// La méthode sign prend 2 arguments :
// 1 - La donnée à encoder.
// 2- Le code secret à utiliser. Tu as besoin de ce code secret pour "signer" notre encodage et nous assurer que personne ne sera en mesure de créer le même token. Sans ce code secret, le token n'est pas valide.
const calculateJwtToken = (usermail, userId) => {
  return jwt.sign({ email: usermail, userId: userId }, PRIVATE_KEY, {
    expiresIn: "24h",
  });
};
// Le token lui-même contient la version codée de l'e-mail.
// De cette façon, nous n'avons pas besoin de stocker le token dans la base de données lors de la connexion.

// Methode .decode permet de récupérer des infos du token (exemple dans notre cas l' email et le user_id de l'user à partir du token JWT)
const decodeUserFromJWT = (token) => {
  return jwt.decode(token);
};

const findOneUser = async (email) => {
  let request = `SELECT * FROM users WHERE email = '${email}'`;
  return await db
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
  language,
  token
) => {
  let request = `INSERT INTO users(firstname, lastname, email, password, city, language, token) VALUES ('${firstname}', '${lastname}', '${email}', '${hashedPassword}', '${city}', '${language}', '${token}')`;
  return db
    .promise()
    .query(request)
    .then((result) => result);
};

const update = async (id, token) => {
  return await db
    .promise()
    .query("UPDATE users SET token = ? WHERE id = ?", [token, id]);
};

module.exports = {
  findOneUser,
  createUsers,
  hashPassword,
  verifyPassword,
  authControle,
  getPassword,
  calculateToken,
  update,
  calculateJwtToken,
  decodeUserFromJWT,
};
