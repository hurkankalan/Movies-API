const usersModels = require("../models/users-models");
const Joi = require("joi");

const createOneUser = async (req, res) => {
  const { firstname, lastname, email, password, city, language } = req.body;
  let errorData = null;
  const hashedPassword = await usersModels.hashPassword(password);
  usersModels
    .findOneUser(email)
    .then((result) => {
      if (result[0].length !== 0) return Promise.reject("DUPLICATE_EMAIL");
      else {
        errorData = Joi.object({
          firstname: Joi.string().max(255).required(),
          lastname: Joi.string().max(255).required(),
          email: Joi.string().max(255).required(),
          password: Joi.string().max(255).required(),
          city: Joi.string().max(255),
          language: Joi.string().max(255),
        }).validate({ ...req.body }, { abortEarly: false }).error;
        if (errorData) return Promise.reject("INVALIDE_DATA");
        return usersModels.createUsers(
          firstname,
          lastname,
          email,
          hashedPassword,
          city,
          language
        );
      }
    })
    .then((result) => {
      const data = {
        result,
        firstname,
        lastname,
        hashedPassword,
        email,
        city,
        language,
      };
      res.status(201).json(data);
    })
    .catch((error) => {
      console.log(error);
      if (error === "DUPLICATE_EMAIL")
        res.status(409).send("Email already exist");
      else if (error === "INVALID_DATA") res.status(422).send("Data invalid");
      else res.status(500).send(`Error saving the user : ${error.message}`);
    });
};

const authControleUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const verifMailIsExisting = await usersModels.findOneUser(email);
    if (verifMailIsExisting[0].length > 0) {
      const hashedPassword = await usersModels.verifyPassword(
        verifMailIsExisting[0][0].password,
        password
      );
      if (hashedPassword) {
        res.status(200).send("Authentification réussi avec succès !");
      } else {
        res.status(401).send("Mot de passe incorrect");
      }
    } else {
      res.status(401).send("Identifiant incorrect");
    }
  } catch (e) {
    res
      .status(500)
      .send("Une erreur a été rencontré lors de l'authentification");
  }
};

module.exports = { createOneUser, authControleUser };
