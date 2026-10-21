// Anrop för annonser mot backend (GET /api/items och GET /api/items/:id).
import { apiFetch } from "./api.js";

// Hämtar annonser. Alla filter är frivilliga: search (sökord), categoryId och location (stad).
export async function getItems({ search, categoryId, location } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (categoryId) params.set("category_id", categoryId);
  if (location) params.set("location", location);

  const query = params.toString();
  const data = await apiFetch(`/api/items${query ? `?${query}` : ""}`);
  return data.items;
}

// Hämtar en annons med id
export async function getItem(id) {
  const data = await apiFetch(`/api/items/${id}`);
  return data.item;
}
