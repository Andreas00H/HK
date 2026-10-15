// Registrering med namn, e-post, telefon, lösenord och stad mot POST /api/auth/register (UI.UX.md, Logga in / Registrera).
// Efter lyckad registrering loggas man in direkt och skickas vidare som från Logga in.
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/common/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useCity } from "../hooks/useCity.js";
import "../assets/styles/forms.css";

// Samma enkla kontroll som backend gör
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Kontrollerar fälten innan något skickas. Returnerar ett fel per fält, tomt objekt om allt är ok.
function validate({ name, email, phone, password, location }) {
  const errors = {};
  if (!name.trim()) errors.name = "Fyll i ditt namn.";
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Fyll i en giltig e-postadress.";
  if (!phone.trim()) errors.phone = "Fyll i ditt telefonnummer.";
  if (password.length < 8) errors.password = "Lösenordet måste vara minst 8 tecken.";
  if (!location.trim()) errors.location = "Fyll i din stad.";
  return errors;
}

export default function Register() {
  const { token, register } = useAuth();
  const { city } = useCity();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Staden förifylls med den som är vald i sidhuvudet (standard Stockholm)
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", location: city });
  const [errors, setErrors] = useState({}); // ett fel per fält, plus form för övriga fel från backend
  const [sending, setSending] = useState(false);

  if (token) return <Navigate to={from} replace />;

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSending(true);
    try {
      await register(form);
      navigate(from, { replace: true });
    } catch (err) {
      // 409 = e-posten används redan, visas under e-postfältet. Övriga fel visas ovanför knappen.
      setErrors(err.status === 409 ? { email: err.message } : { form: err.message });
      setSending(false);
    }
  }

  return (
    <section className="page auth-page">
      <Link to="/" className="auth-logo">
        HK <span className="header-logo-sub">Hyra inte Köpa</span>
      </Link>
      <h1 className="page-title">Skapa konto</h1>

      <form className="card auth-form" onSubmit={handleSubmit} noValidate>
        <Input id="name" label="Namn" autoComplete="name" value={form.name} onChange={update("name")} error={errors.name} />
        <Input
          id="email"
          label="E-post"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
        />
        <Input
          id="phone"
          label="Telefon"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={update("phone")}
          error={errors.phone}
        />
        <Input
          id="password"
          label="Lösenord"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          hint="Minst 8 tecken."
        />
        <Input
          id="location"
          label="Stad"
          autoComplete="address-level2"
          value={form.location}
          onChange={update("location")}
          error={errors.location}
        />

        {errors.form && (
          <p className="field-error" role="alert">
            {errors.form}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          {sending ? "Skapar konto…" : "Skapa konto"}
        </button>
      </form>

      <p className="auth-switch">
        Har du redan ett konto? <Link to="/login" state={location.state}>Logga in</Link>
      </p>
    </section>
  );
}
