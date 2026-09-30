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

// Skapar en annons. userId kommer från JWT, aldrig från klienten.
async function createItem(userId, body) {
  const name = requireText(body.name, "name", 150);
  const description = requireText(body.description, "description", 2000);
  const condition = requireText(body.condition, "condition", 50);
  const location = requireText(body.location, "location", 100);
  const imageUrl = requireText(body.image_url, "image_url", 2000);

  const categoryId = Number(body.category_id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw httpError(400, "Ogiltig kategori");
  }

  // Priset måste finnas och vara ett tal mellan 0 och 100000
  const lendingPrice = Number(body.lending_price);
  if (
    body.lending_price === undefined ||
    body.lending_price === null ||
    body.lending_price === "" ||
    !Number.isFinite(lendingPrice) ||
    lendingPrice < 0 ||
    lendingPrice > 100000
  ) {
    throw httpError(400, "Ogiltigt pris per dag");
  }

  try {
    return await itemModel.createItem({
      ownerId: userId,
      categoryId,
      name,
      lendingPrice,
      description,
      condition,
      location,
      imageUrl,
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

module.exports = { createItem, getItems, getItem };