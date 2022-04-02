const express = require("express");
const app = express();
const port = 8000;
const db = require("./config/db_config");
const Joi = require("joi");
const { setupRoutes } = require("./routes/index-routes");

// Pour qu'Express puisse lire les contenus de requête JSON par défaut, il faut utiliser un middleware Express intégré: express.json().
app.use(express.json());

setupRoutes(app);

// Route pour créer un nouveau utilisateur dans la BDD avec verification des champs et generation d'erreur si le meme mail user existe deja
app.post("/api/users", (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  let errorValidation = null;
  db.promise()
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then((result) => {
      if (result[0].length !== 0) {
        //res.status(409).send("Email already exist");
        return Promise.reject("DUPLICATE_EMAIL");
      } else {
        errorValidation = Joi.object({
          firstname: Joi.string().max(255).required(),
          lastname: Joi.string().max(255).required(),
          email: Joi.string().email().max(255).required(),
          city: Joi.string().max(255).required(),
          language: Joi.string().max(255).required(),
        }).validate({ ...req.body }, { abortEarly: false }).error;
        if (errorValidation) {
          console.log(errorValidation);
          //res.status(422).send("Data invalid");
          return Promise.reject("INVALID_DATA");
        }
        return db
          .promise()
          .query(
            `INSERT INTO users(firstname, lastname, email, city, language) VALUES(?, ?, ?, ?, ?)`,
            [firstname, lastname, email, city, language]
          );
      }
    })
    .then(({ result }) => {
      // le precedent then renvoie l'id de la requete, pas besoin d'aller chercher dans result.insertId;
      const data = { result, firstname, lastname, email, city, language };
      res.status(201).json(data);
    })
    .catch((error) => {
      if (error === "DUPLICATE_EMAIL") {
        res.status(409).send("Email already exist");
      } else if (error === "INVALID_DATA") {
        res.status(422).send("Data invalid");
      } else {
        res.status(500).send(`Error saving the user : ${error.message}`);
      }
    });
});

app.listen(port, (err) => {
  if (err) throw err;
  else console.log(`Server is listening on port ${8000}`);
});
