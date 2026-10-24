// Anrop för omdömen mot backend (POST /api/reviews).
import { apiFetch } from "./api.js";

// Lämnar ett omdöme om motparten i en avslutad förfrågan. Backend sätter vem som recenseras utifrån JWT.
// rating måste vara ett heltal 1–5, comment är valfri (max 1000 tecken).
export async function createReview({ borrowingId, rating, comment }, token) {
  const body = { borrowing_id: borrowingId, rating };
  if (comment) body.comment = comment;
  return apiFetch("/api/reviews", { method: "POST", body, token });
}