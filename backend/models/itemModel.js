// Databasfrågor för tabellen items
const pool = require("../db/db");

// Skapar en ny annons och returnerar den
async function createItem({ ownerId, categoryId, name, lendingPrice, description, condition, location, imageUrl }) {
  const result = await pool.query(
    `INSERT INTO items
       (owner_id, category_id, name, lending_price, description, condition, location, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [ownerId, categoryId, name, lendingPrice, description, condition, location, imageUrl]
  );
  return result.rows[0];
}

// Hämtar tillgängliga annonser, med valfria filter
async function findAll({ search, categoryId, location }) {
  const conditions = ["items.available = TRUE"];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(items.name ILIKE $${values.length} OR items.description ILIKE $${values.length})`
    );
  }
  if (categoryId) {
    values.push(categoryId);
    conditions.push(`items.category_id = $${values.length}`);
  }
  if (location) {
    values.push(location);
    conditions.push(`LOWER(items.location) = LOWER($${values.length})`);
  }

  const result = await pool.query(
    `SELECT items.*, categories.name AS category_name, users.name AS owner_name
     FROM items
     JOIN categories ON categories.id = items.category_id
     JOIN users ON users.id = items.owner_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY items.created_at DESC`,
    values
  );
  return result.rows;
}

// Hämtar en annons via id (även om den inte är tillgänglig)
async function findById(id) {
  const result = await pool.query(
    `SELECT items.*, categories.name AS category_name, users.name AS owner_name
     FROM items
     JOIN categories ON categories.id = items.category_id
     JOIN users ON users.id = items.owner_id
     WHERE items.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

// Uppdaterar valda kolumner på en annons och returnerar den
async function updateItem(id, fields) {
  // Endast dessa kolumner får ändras (vitlista, så ingen kan skicka in egna kolumnnamn)
  const allowed = [
    "category_id", "name", "lending_price", "description",
    "condition", "location", "image_url", "available",
  ];
  const keys = Object.keys(fields).filter((key) => allowed.includes(key));
  const setParts = keys.map((key, i) => `${key} = $${i + 1}`);
  const values = keys.map((key) => fields[key]);
  values.push(id);

  const result = await pool.query(
    `UPDATE items SET ${setParts.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

// Raderar en annons
async function deleteItem(id) {
  await pool.query("DELETE FROM items WHERE id = $1", [id]);
}

module.exports = { createItem, findAll, findById, updateItem, deleteItem };