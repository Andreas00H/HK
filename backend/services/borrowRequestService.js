// Affärsregler för låneförfrågningar
const borrowRequestModel = require("../models/borrowRequestModel");
const itemModel = require("../models/itemModel");

// Skapar ett fel med HTTP-statuskod som controllern kan skicka vidare
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Tillåtna statusbyten: från status → lista över giltiga nästa statusar
const ALLOWED_TRANSITIONS = {
  REQUESTED: ["ACCEPTED", "DECLINED"],
  ACCEPTED: ["DECLINED", "BORROWED"],
  BORROWED: ["RETURNED"],
  RETURNED: ["COMPLETED"],
  DECLINED: [],
  COMPLETED: [],
};


// Kontrollerar att texten är ett riktigt datum i formatet ÅÅÅÅ-MM-DD
function requireDate(value, fieldName) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw httpError(400, `Fältet "${fieldName}" måste vara ett datum (ÅÅÅÅ-MM-DD)`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw httpError(400, `Fältet "${fieldName}" är inte ett giltigt datum`);
  }
  return value;
}

// Skapar en låneförfrågan. borrowerId kommer från JWT, aldrig från klienten.
async function createRequest(borrowerId, body) {
  const itemId = Number(body.item_id);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw httpError(400, "Ogiltigt annons-id");
  }

  const startDate = requireDate(body.start_date, "start_date");
  const endDate = requireDate(body.end_date, "end_date");

  // Datum i ÅÅÅÅ-MM-DD kan jämföras som text
  if (endDate < startDate) {
    throw httpError(400, "Slutdatum kan inte vara före startdatum");
  }
  const today = new Date().toISOString().slice(0, 10);
  if (startDate < today) {
    throw httpError(400, "Startdatum kan inte vara i det förflutna");
  }

  const item = await itemModel.findById(itemId);
  if (!item) {
    throw httpError(404, "Annonsen finns inte");
  }
  if (item.owner_id === borrowerId) {
    throw httpError(403, "Du kan inte låna din egen sak");
  }
  if (!item.available) {
    throw httpError(409, "Annonsen är inte tillgänglig");
  }

  return borrowRequestModel.createRequest({ itemId, borrowerId, startDate, endDate });
}


// Hämtar användarens skickade och mottagna förfrågningar
async function getMyRequests(userId) {
  const rows = await borrowRequestModel.findAllForUser(userId);

  // Skickade = jag är lånare. Mottagna = jag äger saken.
  const sent = rows.filter((row) => row.borrower_id === userId);
  const received = rows.filter((row) => row.owner_id === userId);

  return { sent, received };
}


// Byter status på en förfrågan (endast ägaren, endast giltiga byten)
async function updateStatus(userId, id, body) {
  const requestId = Number(id);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw httpError(400, "Ogiltigt förfrågnings-id");
  }

  const newStatus = body.status;
  if (typeof newStatus !== "string" || !Object.keys(ALLOWED_TRANSITIONS).includes(newStatus)) {
    throw httpError(400, "Ogiltig status");
  }

  const request = await borrowRequestModel.findById(requestId);
  if (!request) {
    throw httpError(404, "Förfrågan finns inte");
  }

  // Bara ägaren till saken får ändra status
  if (request.owner_id !== userId) {
    throw httpError(403, "Endast ägaren kan ändra status");
  }

  if (!ALLOWED_TRANSITIONS[request.status].includes(newStatus)) {
    throw httpError(409, `Ogiltigt statusbyte: ${request.status} till ${newStatus}`);
  }

  const updated = await borrowRequestModel.updateStatus(request.id, request.status, newStatus);
  if (!updated) {
    throw httpError(409, "Statusen ändrades just nu, försök igen");
  }
  return updated;
}


// Hämtar kontakter (motparter i godkända förfrågningar)
async function getContacts(userId) {
  return borrowRequestModel.findContactsForUser(userId);
}


module.exports = { createRequest, getMyRequests, updateStatus, getContacts };