// Tar emot HTTP-anrop för kategorier
const categoryModel = require("../models/categoryModel");

// GET /api/categories
async function getCategories(req, res, next) {
  try {
    const categories = await categoryModel.findAll();
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories };