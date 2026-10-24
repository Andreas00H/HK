// Kontakter (UI.UX.md 8.2): motparter i förfrågningar som är godkända eller längre fram, med telefon och e-post
// från GET /api/contacts. Ingen chatt, parterna hör av sig till varandra själva.
// Pågående (Godkänd, Utlånad) visas först, sedan Återlämnad och Avslutad.
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ContactCard from "../components/contacts/ContactCard.jsx";
import { getContacts } from "../services/contactService.js";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/items.css";
import "../assets/styles/contacts.css";

// Sorteringsgrupp per status: 0 = pågående, 1 = återlämnad eller avslutad
const GROUP = { ACCEPTED: 0, BORROWED: 0, RETURNED: 1, COMPLETED: 1 };

export default function Contacts() {
  const { token } = useAuth();
  // Ny key varje gång man trycker på Kontakter i menyn, även när man redan är här. Då hämtas listan på nytt,
  // t.ex. när man väntar på att en förfrågan ska bli godkänd.
  const { key: visit } = useLocation();
  const [contacts, setContacts] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // ökas av "Försök igen" så att listan hämtas på nytt

  useEffect(() => {
    let cancelled = false;
    setContacts(null);
    setError(null);

    getContacts(token)
      .then((result) => {
        if (!cancelled) setContacts(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token, attempt, visit]);

  // Backend skickar nyast först. sort behåller den ordningen inom varje grupp.
  const sorted = contacts && [...contacts].sort((a, b) => (GROUP[a.status] ?? 2) - (GROUP[b.status] ?? 2));

  return (
    <section className="page contacts">
      <h1 className="page-title page-header">Kontakter</h1>
      <p className="muted">
        Kontaktuppgifter visas när en förfrågan är godkänd. Betalning och upphämtning sköter ni själva.
      </p>

      {error && (
        <div className="message message-error" role="alert">
          <p>
            Kunde inte hämta kontakter.{" "}
            <button type="button" className="link-button" onClick={() => setAttempt(attempt + 1)}>
              Försök igen
            </button>
          </p>
        </div>
      )}

      {!error && !sorted && (
        <div className="contact-list" role="status">
          <span className="visually-hidden">Hämtar kontakter…</span>
          {[1, 2].map((n) => (
            <div key={n} className="card skeleton-card" aria-hidden="true">
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ))}
        </div>
      )}

      {sorted && sorted.length === 0 && (
        <div className="message contacts-empty">
          <p>Här hamnar kontaktuppgifter när en förfrågan blir godkänd.</p>
          <Link to="/" className="btn btn-secondary">
            Hitta något att låna
          </Link>
        </div>
      )}

      {sorted && sorted.length > 0 && (
        <ul className="contact-list">
          {sorted.map((contact) => (
            <li key={contact.request_id}>
              <ContactCard contact={contact} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
