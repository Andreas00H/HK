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

// Hämtar mina förfrågningar som { sent, received }: sent = jag vill låna, received = någon vill låna min sak.
// Varje förfrågan har även item_name, lending_price, owner_id, owner_name och borrower_name.
export async function getMyBorrowRequests(token) {
  return apiFetch("/api/borrow-requests/my", { token });
}

// Byter status på en förfrågan (endast ägaren). Backend avgör om bytet är tillåtet.
export async function updateBorrowRequestStatus(id, status, token) {
  const data = await apiFetch(`/api/borrow-requests/${id}`, { method: "PUT", token, body: { status } });
  return data.borrowRequest;
}
