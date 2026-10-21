// Hook för inloggningen. Används t.ex. så här: const { user, token, login, logout } = useAuth();
// token är null när ingen är inloggad.
import { useContext } from "react";
import { AuthContext } from "../context/authContext.js";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth måste användas inuti AuthProvider");
  return context;
}
