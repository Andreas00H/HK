// Kopplar URL:er för annonser till controllern
const express = require("express");
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/items (öppen för alla)
router.get("/", itemController.getItems);

// GET /api/items/:id (öppen för alla)
router.get("/:id", itemController.getItem);

module.exports = router;