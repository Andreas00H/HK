// Anrop för kategorier mot backend (GET /api/categories).
import { apiFetch } from "./api.js";

export async function getCategories() {
  const data = await apiFetch("/api/categories");
  return data.categories;
}
