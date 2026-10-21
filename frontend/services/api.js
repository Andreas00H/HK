// Gemensam fetch-hjälp mot backend. Alla services (authService, itemService osv.) ska gå via apiFetch.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Gör ett anrop till backend. Skickar med JWT om användaren är inloggad.
// Returnerar JSON-svaret, eller kastar ett fel med backendens svenska felmeddelande.
export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Servern svarar inte alls (nere, fel VITE_API_URL eller CORS). Annars visas webbläsarens engelska "Failed to fetch".
    throw new Error("Kunde inte nå servern. Försök igen om en stund.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.error || `Något gick fel (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}
