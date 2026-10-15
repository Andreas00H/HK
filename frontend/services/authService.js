// Anrop för registrering och inloggning mot backend (POST /api/auth/register och /api/auth/login).
import { apiFetch } from "./api.js";

// Skapar ett konto. Backend svarar med användaren men ingen token, så man loggar in efteråt.
export async function register({ name, email, phone, password, location }) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: { name, email, phone, password, location },
  });
  return data.user;
}

// Loggar in. Returnerar { token, user }, där user saknar lösenordshash.
export async function login({ email, password }) {
  return apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
}
