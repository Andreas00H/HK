// Samlar användarens översikt: egna annonser, skickade och mottagna förfrågningar, pågående lån
const itemModel = require("../models/itemModel");
const borrowRequestService = require("./borrowRequestService");

// Statusar som räknas som pågående (godkänd eller utlämnad)
const ONGOING_STATUSES = ["ACCEPTED", "BORROWED"];

async function getDashboard(userId) {
  const [items, requests] = await Promise.all([
    itemModel.findByOwner(userId),
    borrowRequestService.getMyRequests(userId),
  ]);

  // Man kan inte låna sin egen sak, så sent och received överlappar aldrig
  const ongoing = [...requests.sent, ...requests.received].filter((request) =>
    ONGOING_STATUSES.includes(request.status)
  );

  return {
    items,
    sent: requests.sent,
    received: requests.received,
    ongoing,
  };
}

module.exports = { getDashboard };