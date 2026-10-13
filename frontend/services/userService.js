// Anrop för användare mot backend (GET /api/users/:id = publik profil med omdömen och snittbetyg).
import { apiFetch } from "./api.js";

export async function getUser(id) {
  const data = await apiFetch(`/api/users/${id}`);
  return data.user;
}
