// Anrop för översikten mot backend (GET /api/dashboard). Kräver JWT (token) från inloggningen.
import { apiFetch } from "./api.js";

// Hämtar { items, sent, received, ongoing }: mina annonser (även de som inte är tillgängliga), förfrågningar jag har
// skickat, förfrågningar på mina annonser och pågående lån. Förfrågningarna har samma fält som GET /api/borrow-requests/my.
export async function getDashboard(token) {
  return apiFetch("/api/dashboard", { token });
}
