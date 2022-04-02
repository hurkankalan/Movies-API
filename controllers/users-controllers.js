const usersModels = require("../models/users-models");
const Joi = require("joi");

const createOneUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  let errorData = null;
  usersModels
    .findOneUser(email)
    .then((result) => {
      if (result[0].length !== 0) return Promise.reject("DUPLICATE_EMAIL");
      else {
        errorData = Joi.object({
          firstname: Joi.string().max(255).required(),
          lastname: Joi.string().max(255).required(),
          email: Joi.string().max(255).required(),
          city: Joi.string().max(255),
          language: Joi.string().max(255),
        }).validate({ ...req.body }, { abortEarly: false }).error;
        if (errorData) return Promise.reject("INVALIDE_DATA");
        return usersModels.createUsers(
          firstname,
          lastname,
          email,
          city,
          language
        );
      }
    })
    .then((result) => {
      const data = { result, firstname, lastname, email, city, language };
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

module.exports = { createOneUser };
