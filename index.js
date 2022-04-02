const express = require("express");
const app = express();
const port = 8000;
const db = require("./config/db_config");
const { setupRoutes } = require("./routes/index-routes");

// Pour qu'Express puisse lire les contenus de requête JSON par défaut, il faut utiliser un middleware Express intégré: express.json().
app.use(express.json());

setupRoutes(app);

app.listen(port, (err) => {
  if (err) throw err;
  else console.log(`Server is listening on port ${8000}`);
});
