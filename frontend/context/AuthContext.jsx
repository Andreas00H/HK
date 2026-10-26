// Provider för inloggningen. JWT och inloggad användare sparas i localStorage så att man är kvar
// inloggad efter omladdning. E-post och telefon finns bara här, eftersom GET /api/users/:id aldrig
// skickar kontaktuppgifter (UI.UX.md 8.4).
import { useEffect, useState } from "react";
import { AuthContext } from "./authContext.js";
import { setUnauthorizedHandler } from "../services/api.js";
import * as authService from "../services/authService.js";

const TOKEN_KEY = "hk_token";
const USER_KEY = "hk_user";
const LOGGED_OUT = { token: null, user: null };

// Läser utgångstiden (exp, i sekunder) ur JWT:ns mittdel. Går den inte att läsa räknas den som utgången.
function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

// localStorage kan vara avstängt (t.ex. privat läge), därför try/catch runt alla anrop
function saveSession({ token, user }) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Inloggningen gäller då bara tills sidan laddas om
  }
}

function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Inget sparat att ta bort
  }
}

// Hämtar sparad inloggning vid start. Saknas den, är den trasig eller har token gått ut börjar man utloggad.
function loadSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (token && user && !isExpired(token)) return { token, user };
  } catch {
    // Trasig JSON eller avstängt localStorage
  }
  clearSession();
  return LOGGED_OUT;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

    // När backend svarar 401 på ett inloggat anrop rensas sessionen. ProtectedRoute skickar sedan användaren till /login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      setSession(LOGGED_OUT);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  // Kastar fel med backendens meddelande, t.ex. "Fel e-post eller lösenord"
  async function login({ email, password }) {
    const { token, user } = await authService.login({ email, password });
    saveSession({ token, user });
    setSession({ token, user });
    return user;
  }

  // Skapar konto och loggar sedan in direkt med samma uppgifter
  async function register(fields) {
    await authService.register(fields);
    return login({ email: fields.email, password: fields.password });
  }

  function logout() {
    clearSession();
    setSession(LOGGED_OUT);
  }

  return (
    <AuthContext.Provider value={{ token: session.token, user: session.user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
