// Anrop för annonser mot backend (GET, POST, PUT och DELETE på /api/items).
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

// Skapar en annons och returnerar den. Backend tar inte emot available här, nya annonser är alltid tillgängliga.
export async function createItem(fields, token) {
  const data = await apiFetch("/api/items", { method: "POST", token, body: fields });
  return data.item;
}

// Ändrar en annons (endast ägaren). Bara fälten som skickas med ändras.
export async function updateItem(id, fields, token) {
  const data = await apiFetch(`/api/items/${id}`, { method: "PUT", token, body: fields });
  return data.item;
}

// Raderar en annons (endast ägaren). Backend svarar utan innehåll.
export async function deleteItem(id, token) {
  await apiFetch(`/api/items/${id}`, { method: "DELETE", token });
}
