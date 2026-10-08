// Tar emot HTTP-anrop för omdömen och skickar vidare till reviewService
const reviewService = require("../services/reviewService");

// POST /api/reviews
async function createReview(req, res, next) {
  try {
    const review = await reviewService.createReview(req.user.id, req.body || {});
    res.status(201).json({ review });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

// GET /api/reviews/user/:id
async function getUserReviews(req, res, next) {
  try {
    const result = await reviewService.getUserReviews(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { createReview, getUserReviews };