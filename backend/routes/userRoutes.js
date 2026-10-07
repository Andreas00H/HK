// Kopplar URL:er för användare till controllern
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// GET /api/users/:id
router.get("/:id", userController.getUser);

module.exports = router;