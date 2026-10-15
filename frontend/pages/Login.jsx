// Inloggning med e-post och lösenord mot POST /api/auth/login (UI.UX.md, Logga in / Registrera).
// Efter inloggning skickas man tillbaka till sidan man försökte nå (från ProtectedRoute), annars till Hem.
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/common/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/forms.css";

export default function Login() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // email, password och form (fel från backend)
  const [sending, setSending] = useState(false);

  // Redan inloggad, t.ex. efter Tillbaka i webbläsaren
  if (token) return <Navigate to={from} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const fieldErrors = {};
    if (!email.trim()) fieldErrors.email = "Fyll i din e-post.";
    if (!password) fieldErrors.password = "Fyll i ditt lösenord.";
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSending(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      // Backend skickar samma text oavsett om e-post eller lösenord är fel: "Fel e-post eller lösenord"
      setErrors({ form: err.message });
      setSending(false);
    }
  }

  return (
    <section className="page auth-page">
      <Link to="/" className="auth-logo">
        HK <span className="header-logo-sub">Hyra inte Köpa</span>
      </Link>
      <h1 className="page-title">Logga in</h1>

      <form className="card auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          label="E-post"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          id="password"
          label="Lösenord"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {errors.form && (
          <p className="field-error" role="alert">
            {errors.form}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          {sending ? "Loggar in…" : "Logga in"}
        </button>
      </form>

      {/* state skickas vidare så att man ändå hamnar rätt efter registrering */}
      <p className="auth-switch">
        Inget konto? <Link to="/register" state={location.state}>Skapa konto</Link>
      </p>
    </section>
  );
}
