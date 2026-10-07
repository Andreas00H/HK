// Databasfrågor för tabellen categories
const pool = require("../db/db");

// Hämtar alla kategorier
async function findAll() {
  const result = await pool.query(
    "SELECT id, name FROM categories ORDER BY id"
  );
  return result.rows;
}

module.exports = { findAll };