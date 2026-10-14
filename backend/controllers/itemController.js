// Tar emot HTTP-anrop för annonser och skickar vidare till itemService
const itemService = require("../services/itemService");
const { isNonEmptyString, isPositiveInt, isPositiveNumber, sendIfInvalid } = require("../middleware/validate");

// POST /api/items
async function createItem(req, res, next) {
  try {
    const item = await itemService.createItem(req.user.id, req.body || {});
    res.status(201).json({ item });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }

  const { name, category_id, lending_price, description, condition, location } = req.body;

  // Validera indata innan vi rör databasen
  const errors = [];
  if (!isNonEmptyString(name, 150)) errors.push("name saknas eller är ogiltigt");
  if (!isPositiveInt(category_id)) errors.push("category_id måste vara ett positivt heltal");
  if (!isPositiveNumber(lending_price)) errors.push("lending_price måste vara ett tal som är 0 eller mer");
  if (!isNonEmptyString(description, 2000)) errors.push("description saknas");
  if (!isNonEmptyString(condition, 100)) errors.push("condition saknas");
  if (!isNonEmptyString(location, 100)) errors.push("location saknas");
  if (sendIfInvalid(res, errors)) return;
}


// GET /api/items
async function getItems(req, res, next) {
  try {
    const items = await itemService.getItems(req.query);
    res.status(200).json({ items });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

// GET /api/items/:id
async function getItem(req, res, next) {
  try {
    const item = await itemService.getItem(req.params.id);
    res.status(200).json({ item });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}



// PUT /api/items/:id
async function updateItem(req, res, next) {
  try {
    const item = await itemService.updateItem(req.user.id, req.params.id, req.body || {});
    res.status(200).json({ item });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }

  const errors = [];
  const b = req.body;
  if (b.name !== undefined && !isNonEmptyString(b.name, 150)) errors.push("name är ogiltigt");
  if (b.category_id !== undefined && !isPositiveInt(b.category_id)) errors.push("category_id är ogiltigt");
  if (b.lending_price !== undefined && !isPositiveNumber(b.lending_price)) errors.push("lending_price är ogiltigt");
  if (b.description !== undefined && !isNonEmptyString(b.description, 2000)) errors.push("description är ogiltigt");
  if (b.condition !== undefined && !isNonEmptyString(b.condition, 100)) errors.push("condition är ogiltigt");
  if (b.location !== undefined && !isNonEmptyString(b.location, 100)) errors.push("location är ogiltigt");
  if (sendIfInvalid(res, errors)) return;

}

// DELETE /api/items/:id
async function deleteItem(req, res, next) {
  try {
    await itemService.deleteItem(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { createItem, getItems, getItem, updateItem, deleteItem };