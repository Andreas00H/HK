// Affärsregler för användare
const userModel = require("../models/userModel");
const reviewService = require("./reviewService");

// Skapar ett fel med HTTP-statuskod som controllern kan skicka vidare
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Hämtar en publik profil via id, med omdömen och snittbetyg
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

  // Återanvänder logiken för omdömen så att snittet räknas på ett ställe
  const { reviews, count, average_rating } = await reviewService.getUserReviews(userId);

  return { ...user, review_count: count, average_rating, reviews };
}

module.exports = { getPublicProfile };