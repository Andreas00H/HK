// Affärsregler för användare
const userModel = require("../models/userModel");

// Skapar ett fel med HTTP-statuskod som controllern kan skicka vidare
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Hämtar en publik profil via id
async function getPublicProfile(id) {
  // id kommer som text från URL:en, så vi gör om och kontrollerar det
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw httpError(400, "Ogiltigt användar-id");
  }

  const user = await userModel.findPublicById(userId);
  if (!user) {
    throw httpError(404, "Användaren finns inte");
  }
  return user;
}

module.exports = { getPublicProfile };