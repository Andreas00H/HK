// Databasfrågor för tabellen reviews
const pool = require("../db/db");

// Sparar ett omdöme och returnerar det
async function createReview({ borrowingId, reviewerId, reviewedUserId, rating, comment }) {
  const result = await pool.query(
    `INSERT INTO reviews (borrowing_id, reviewer_id, reviewed_user_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [borrowingId, reviewerId, reviewedUserId, rating, comment]
  );
  return result.rows[0];
}

// Hämtar alla omdömen som en användare har fått
async function findByReviewedUser(userId) {
  const result = await pool.query(
    `SELECT reviews.id,
            reviews.borrowing_id,
            reviews.rating,
            reviews.comment,
            reviews.created_at,
            reviewer.id AS reviewer_id,
            reviewer.name AS reviewer_name,
            items.name AS item_name
     FROM reviews
     JOIN users reviewer ON reviewer.id = reviews.reviewer_id
     JOIN borrow_requests br ON br.id = reviews.borrowing_id
     JOIN items ON items.id = br.item_id
     WHERE reviews.reviewed_user_id = $1
     ORDER BY reviews.created_at DESC`,
    [userId]
  );
  return result.rows;
}

module.exports = { createReview, findByReviewedUser };