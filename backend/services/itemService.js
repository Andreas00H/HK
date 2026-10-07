// Affärsregler för annonser
const itemModel = require("../models/itemModel");

// Skapar ett fel med HTTP-statuskod som controllern kan skicka vidare
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Kräver en icke-tom text som inte är längre än maxLength
function requireText(value, fieldName, maxLength) {
  if (typeof value !== "string" || value.trim() === "") {
    throw httpError(400, `Fältet "${fieldName}" krävs`);
  }
  const clean = value.trim();
  if (clean.length > maxLength) {
    throw httpError(400, `Fältet "${fieldName}" får vara max ${maxLength} tecken`);
  }
  return clean;
}

// Validerar annonsfält. requireAll = true vid skapande, false vid ändring
// (då kontrolleras bara de fält som skickats med).
function validateItemFields(body, requireAll) {
  const clean = {};

  const textFields = [
    ["name", 150],
    ["description", 2000],
    ["condition", 50],
    ["location", 100],
    ["image_url", 2000],
  ];
  for (const [key, maxLength] of textFields) {
    if (body[key] !== undefined || requireAll) {
      clean[key] = requireText(body[key], key, maxLength);
    }
  }

  if (body.category_id !== undefined || requireAll) {
    const categoryId = Number(body.category_id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw httpError(400, "Ogiltig kategori");
    }
    clean.category_id = categoryId;
  }

  // Priset måste vara ett tal mellan 0 och 100000
  if (body.lending_price !== undefined || requireAll) {
    const price = Number(body.lending_price);
    if (
      body.lending_price === undefined ||
      body.lending_price === null ||
      body.lending_price === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      price > 100000
    ) {
      throw httpError(400, "Ogiltigt pris per dag");
    }
    clean.lending_price = price;
  }

  // available får bara ändras vid redigering och måste vara true eller false
  if (body.available !== undefined) {
    if (typeof body.available !== "boolean") {
      throw httpError(400, "Fältet \"available\" måste vara true eller false");
    }
    clean.available = body.available;
  }

  return clean;
}

// Hämtar annonsen och kontrollerar att den inloggade användaren är ägaren
async function getOwnedItem(userId, id) {
  const itemId = Number(id);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw httpError(400, "Ogiltigt annons-id");
  }

  const item = await itemModel.findById(itemId);
  if (!item) {
    throw httpError(404, "Annonsen finns inte");
  }
  if (item.owner_id !== userId) {
    throw httpError(403, "Du får bara ändra dina egna annonser");
  }
  return item;
}

// Skapar en annons. userId kommer från JWT, aldrig från klienten.
async function createItem(userId, body) {
  const fields = validateItemFields(body, true);

  try {
    return await itemModel.createItem({
      ownerId: userId,
      categoryId: fields.category_id,
      name: fields.name,
      lendingPrice: fields.lending_price,
      description: fields.description,
      condition: fields.condition,
      location: fields.location,
      imageUrl: fields.image_url,
    });
  } catch (err) {
    // 23503 = främmande nyckel finns inte (kategorin existerar inte)
    if (err.code === "23503") {
      throw httpError(400, "Kategorin finns inte");
    }
    throw err;
  }
}

// Hämtar annonslistan med filter från query-strängen
async function getItems(query) {
  const filters = {};

  if (query.search !== undefined) {
    if (typeof query.search !== "string") {
      throw httpError(400, "Ogiltigt sökord");
    }
    filters.search = query.search.trim();
  }

  if (query.category_id !== undefined && query.category_id !== "") {
    const categoryId = Number(query.category_id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw httpError(400, "Ogiltig kategori");
    }
    filters.categoryId = categoryId;
  }

  if (query.location !== undefined) {
    if (typeof query.location !== "string") {
      throw httpError(400, "Ogiltig stad");
    }
    filters.location = query.location.trim();
  }

  return itemModel.findAll(filters);
}

// Hämtar en annons via id
async function getItem(id) {
  const itemId = Number(id);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw httpError(400, "Ogiltigt annons-id");
  }

  const item = await itemModel.findById(itemId);
  if (!item) {
    throw httpError(404, "Annonsen finns inte");
  }
  return item;
}

// Uppdaterar en annons (endast ägaren)
async function updateItem(userId, id, body) {
  const item = await getOwnedItem(userId, id);
  const fields = validateItemFields(body, false);

  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Inga fält att uppdatera");
  }

  try {
    return await itemModel.updateItem(item.id, fields);
  } catch (err) {
    if (err.code === "23503") {
      throw httpError(400, "Kategorin finns inte");
    }
    throw err;
  }
}

// Raderar en annons (endast ägaren)
async function deleteItem(userId, id) {
  const item = await getOwnedItem(userId, id);
  await itemModel.deleteItem(item.id);
}

module.exports = { createItem, getItems, getItem, updateItem, deleteItem };