// Anrop för låneförfrågningar mot backend. Kräver JWT (token) från inloggningen.
import { apiFetch } from "./api.js";

// Skickar en förfrågan om att låna en sak mellan två datum (ÅÅÅÅ-MM-DD)
export async function createBorrowRequest({ itemId, startDate, endDate }, token) {
  const data = await apiFetch("/api/borrow-requests", {
    method: "POST",
    token,
    body: { item_id: itemId, start_date: startDate, end_date: endDate },
  });
  return data.borrowRequest;
}
