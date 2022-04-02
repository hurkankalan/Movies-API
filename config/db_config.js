require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) =>
  err
    ? console.error("error connecting: " + err.stack)
    : console.log(
        "connected to the database . Thread number is : " + db.threadId
      )
);

module.exports = db;
