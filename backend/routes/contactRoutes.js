// Kopplar URL:er för kontakter till controllern
const express = require("express");
const contactController = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/contacts (kräver inloggning)
router.get("/", authMiddleware, contactController.getContacts);

module.exports = router;