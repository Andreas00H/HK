// Kopplar URL:er för kategorier till controllern
const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// GET /api/categories
router.get("/", categoryController.getCategories);

module.exports = router;