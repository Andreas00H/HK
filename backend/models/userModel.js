// Databasfrågor för tabellen users
const pool = require("../db/db");

// Hämtar en användare via e-post (returnerar null om ingen finns)
async function findByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
}

// Skapar en ny användare och returnerar den utan lösenordshash
async function createUser({ name, email, phone, passwordHash, location }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, location)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, location, created_at`,
    [name, email, phone, passwordHash, location]
  );
  return result.rows[0];
}


// Hämtar publik profil (inga kontaktuppgifter eller lösenordshash)
async function findPublicById(id) {
  const result = await pool.query(
    "SELECT id, name, location, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { findByEmail, createUser, findPublicById };