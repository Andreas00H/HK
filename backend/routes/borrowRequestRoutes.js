// Kopplar URL:er för låneförfrågningar till controllern
const express = require("express");
const borrowRequestController = require("../controllers/borrowRequestController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/borrow-requests (kräver inloggning)
router.post("/", authMiddleware, borrowRequestController.createRequest);

// GET /api/borrow-requests/my (kräver inloggning)
router.get("/my", authMiddleware, borrowRequestController.getMyRequests);

// PUT /api/borrow-requests/:id (kräver inloggning, endast ägaren)
router.put("/:id", authMiddleware, borrowRequestController.updateStatus);

module.exports = router;