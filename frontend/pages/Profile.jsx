// Profil: personuppgifter, val av stad och omdömen.
// Platshållare tills sidan byggs (ansvarig: Alex). Se Docs/UI.UX.md och Figma-mockupsen.
// "Logga ut" finns redan så att inloggningen går att testa hela vägen.
import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Till Hem efter utloggning. React Router byter sida i en transition, så utloggningen måste ligga i
  // samma transition. Annars hinner ProtectedRoute se att man är utloggad och skicka en till Logga in.
  function handleLogout() {
    startTransition(() => {
      logout();
      navigate("/", { replace: true });
    });
  }

  return (
    <section className="page">
      <h1 className="page-title">Profil</h1>
      <p className="muted">
        Inloggad som {user.name} ({user.email}). Resten av sidan är inte byggd än.
      </p>
      <button type="button" className="logout-link" onClick={handleLogout}>
        Logga ut
      </button>
    </section>
  );
}
