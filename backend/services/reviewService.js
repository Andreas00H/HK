// Affärsregler för omdömen
const reviewModel = require("../models/reviewModel");
const borrowRequestModel = require("../models/borrowRequestModel");
const userModel = require("../models/userModel");

// Skapar ett fel med HTTP-statuskod som controllern kan skicka vidare
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Skapar ett omdöme. reviewerId kommer från JWT, aldrig från klienten.
async function createReview(reviewerId, body) {
  const borrowingId = Number(body.borrowing_id);
  if (!Number.isInteger(borrowingId) || borrowingId <= 0) {
    throw httpError(400, "Ogiltigt låne-id");
  }

  if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
    throw httpError(400, "Betyget måste vara ett heltal mellan 1 och 5");
  }

  // Kommentaren är valfri, men om den finns måste den vara text (max 1000 tecken)
  let comment = null;
  if (body.comment !== undefined && body.comment !== null) {
    if (typeof body.comment !== "string") {
      throw httpError(400, "Kommentaren måste vara text");
    }
    comment = body.comment.trim();
    if (comment.length > 1000) {
      throw httpError(400, "Kommentaren får vara max 1000 tecken");
    }
    if (comment === "") {
      comment = null;
    }
  }

  const request = await borrowRequestModel.findById(borrowingId);
  if (!request) {
    throw httpError(404, "Förfrågan finns inte");
  }

  // Den som recenseras är motparten. Utomstående får inte recensera.
  let reviewedUserId;
  if (reviewerId === request.owner_id) {
    reviewedUserId = request.borrower_id;
  } else if (reviewerId === request.borrower_id) {
    reviewedUserId = request.owner_id;
  } else {
    throw httpError(403, "Du deltog inte i det här lånet");
  }

  if (request.status !== "COMPLETED") {
    throw httpError(409, "Omdöme kan bara lämnas när lånet är avslutat");
  }

  try {
    return await reviewModel.createReview({
      borrowingId,
      reviewerId,
      reviewedUserId,
      rating: body.rating,
      comment,
    });
  } catch (err) {
    // 23505 = unikhetsbrott (omdöme redan lämnat för det här lånet)
    if (err.code === "23505") {
      throw httpError(409, "Du har redan lämnat omdöme för det här lånet");
    }
    throw err;
  }
}

// Hämtar en användares omdömen, antal och snittbetyg
async function getUserReviews(id) {
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw httpError(400, "Ogiltigt användar-id");
  }

  const user = await userModel.findPublicById(userId);
  if (!user) {
    throw httpError(404, "Användaren finns inte");
  }

  const reviews = await reviewModel.findByReviewedUser(userId);

  // Snittbetyg avrundat till en decimal (null om inga omdömen finns)
  let averageRating = null;
  if (reviews.length > 0) {
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    averageRating = Math.round((sum / reviews.length) * 10) / 10;
  }

  return { reviews, count: reviews.length, average_rating: averageRating };
}

module.exports = { createReview, getUserReviews };