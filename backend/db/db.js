// Anslutning till PostgreSQL via en pool (flera öppna anslutningar som återanvänds)
const { Pool, types } = require("pg");
require("dotenv").config();

// NUMERIC (typ 1700) returneras som text som standard, gör om till tal
types.setTypeParser(1700, (value) => parseFloat(value));

// DATE (typ 1082) returneras som text "ÅÅÅÅ-MM-DD" i stället för Date-objekt
types.setTypeParser(1082, (value) => value);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Loggar fel som uppstår på inaktiva anslutningar
pool.on("error", (err) => {
  console.error("Oväntat fel i databaspoolen:", err);
});

module.exports = pool;