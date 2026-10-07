// Tar emot HTTP-anrop för annonser och skickar vidare till itemService
const itemService = require("../services/itemService");

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