// Databasfrågor för tabellen borrow_requests
const pool = require("../db/db");

// Skapar en ny förfrågan (status blir REQUESTED via databasens standardvärde)
async function createRequest({ itemId, borrowerId, startDate, endDate }) {
  const result = await pool.query(
    `INSERT INTO borrow_requests (item_id, borrower_id, start_date, end_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [itemId, borrowerId, startDate, endDate]
  );
  return result.rows[0];
}


// Hämtar alla förfrågningar där användaren är lånare eller ägare till saken
async function findAllForUser(userId) {
  const result = await pool.query(
    `SELECT br.*,
            items.name AS item_name,
            items.lending_price,
            items.owner_id,
            owner.name AS owner_name,
            borrower.name AS borrower_name
     FROM borrow_requests br
     JOIN items ON items.id = br.item_id
     JOIN users owner ON owner.id = items.owner_id
     JOIN users borrower ON borrower.id = br.borrower_id
     WHERE br.borrower_id = $1 OR items.owner_id = $1
     ORDER BY br.created_at DESC`,
    [userId]
  );
  return result.rows;
}

// Hämtar en förfrågan tillsammans med ägaren till saken
async function findById(id) {
  const result = await pool.query(
    `SELECT br.*, items.owner_id
     FROM borrow_requests br
     JOIN items ON items.id = br.item_id
     WHERE br.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

// Byter status, men bara om statusen fortfarande är den vi förväntar oss
// (skyddar mot att två anrop ändrar samma förfrågan samtidigt)
async function updateStatus(id, fromStatus, toStatus) {
  const result = await pool.query(
    `UPDATE borrow_requests
     SET status = $3
     WHERE id = $1 AND status = $2
     RETURNING *`,
    [id, fromStatus, toStatus]
  );
  return result.rows[0] || null;
}


// Hämtar kontaktuppgifter till motparten i alla godkända förfrågningar
async function findContactsForUser(userId) {
  const result = await pool.query(
    `SELECT br.id AS request_id,
            br.status,
            br.start_date,
            br.end_date,
            items.id AS item_id,
            items.name AS item_name,
            CASE WHEN br.borrower_id = $1 THEN 'BORROWER' ELSE 'OWNER' END AS my_role,
            other.id AS contact_id,
            other.name AS contact_name,
            other.phone AS contact_phone,
            other.email AS contact_email
     FROM borrow_requests br
     JOIN items ON items.id = br.item_id
     JOIN users other
       ON other.id = CASE WHEN br.borrower_id = $1 THEN items.owner_id ELSE br.borrower_id END
     WHERE (br.borrower_id = $1 OR items.owner_id = $1)
       AND br.status IN ('ACCEPTED', 'BORROWED', 'RETURNED', 'COMPLETED')
     ORDER BY br.created_at DESC`,
    [userId]
  );
  return result.rows;
}


module.exports = { createRequest, findAllForUser, findById, updateStatus, findContactsForUser }; 