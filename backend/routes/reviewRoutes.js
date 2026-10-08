// Kopplar URL:er för omdömen till controllern
const express = require("express");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/reviews (kräver inloggning)
router.post("/", authMiddleware, reviewController.createReview);

// GET /api/reviews/user/:id (öppen för alla)
router.get("/user/:id", reviewController.getUserReviews);

module.exports = router;