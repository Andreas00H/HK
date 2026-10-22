// Anrop för kontakter mot backend (GET /api/contacts). Kräver JWT (token) från inloggningen.
// Bara förfrågningar som är godkända eller längre fram kommer med. Varje kontakt har request_id, status, start_date,
// end_date, item_name, my_role (BORROWER eller OWNER), contact_name, contact_phone och contact_email.
import { apiFetch } from "./api.js";

export async function getContacts(token) {
  const data = await apiFetch("/api/contacts", { token });
  return data.contacts;
}
