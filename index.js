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
// app.post("/api/users", (req, res) => {
//   const { firstname, lastname, email, city, language } = req.body;
//   db.query("SELECT * FROM users WHERE email = ?", [email], (error, result) => {
//     if (result[0]) {
//       console.error(error);
//       res.status(409).send("Email already exist"); // Err 409 quand il y a conflit avec des données deja presente sur bdd
//     } else {
//       const { error } = Joi.object({
//         firstname: Joi.string().max(255).required(),
//         lastname: Joi.string().max(255).required(),
//         email: Joi.string().email().max(255).required(),
//         city: Joi.string().max(255),
//         language: Joi.string().max(255),
//       }).validate({ ...req.body }, { abortEarly: false });
//       if (error) {
//         res.status(422).json({ validationErrors: error.details }); // Err 422 requête a bien été constituée mais pas traitée car erreurs sémantiques.
//       } else {
//         db.query(
//           "INSERT INTO users(firstname, lastname, email, city, language) VALUES(?, ?, ?, ?, ?)",
//           [firstname, lastname, email, city, language],
//           (error, result) => {
//             if (error) {
//               console.error(error);
//               res.status(500).send("Error saving the users");
//             } else {
//               const idUser = result.insertId;
//               const dataReturn = { idUser, ...req.body };
//               res.status(201).send(dataReturn);
//             }
//           }
//         );
//       }
//     }
//   });
// });
// Avec les promesses
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

// Route pour mettre à jour un film dans la BDD avec callback et promesse
app.put("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  let existingMovie = null;
  db.promise()
    .query("SELECT * FROM movies WHERE id = ?", [movieId])
    .then(([results]) => {
      existingMovie = results[0];
      if (!existingMovie) return Promise.reject("RECORD_NOT_FOUND");
      return db
        .promise()
        .query("UPDATE movies SET ? WHERE id = ?", [req.body, movieId]);
    })
    .then(() => {
      res.status(200).json({ ...existingMovie, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === "RECORD_NOT_FOUND")
        res.status(404).send(`Movie with id ${movieId} not found.`);
      else res.status(500).send("Error updating a movie.");
    });
});

app.listen(port, (err) => {
  if (err) throw err;
  else {
    console.log(`Server is listening on port ${8000}`);
  }
});
