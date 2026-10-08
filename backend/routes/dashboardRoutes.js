// Kopplar URL:er för dashboarden till controllern
const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/dashboard (kräver inloggning)
router.get("/", authMiddleware, dashboardController.getDashboard);

module.exports = router;