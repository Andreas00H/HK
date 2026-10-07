// Kopplar URL:er för annonser till controllern
const express = require("express");
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/items (öppen för alla)
router.get("/", itemController.getItems);

// GET /api/items/:id (öppen för alla)
router.get("/:id", itemController.getItem);

// POST /api/items (kräver inloggning)
router.post("/", authMiddleware, itemController.createItem);

// PUT /api/items/:id (kräver inloggning, endast ägaren)
router.put("/:id", authMiddleware, itemController.updateItem);

// DELETE /api/items/:id (kräver inloggning, endast ägaren)
router.delete("/:id", authMiddleware, itemController.deleteItem);

module.exports = router;