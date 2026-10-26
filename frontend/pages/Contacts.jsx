// Kontakter (Figma): flikarna Godkända, Väntar och Avslutade. Ingen chatt, parterna hör av sig till varandra själva.
// Godkända och Avslutade kommer från GET /api/contacts och har telefon och e-post. Väntar är förfrågningar som
// ingen har svarat på än (GET /api/borrow-requests/my), där kontaktuppgifterna inte visas förrän de godkänns.
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ContactCard from "../components/contacts/ContactCard.jsx";
import { getContacts } from "../services/contactService.js";
import { getMyBorrowRequests } from "../services/borrowRequestService.js";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/contacts.css";

const TABS = [
  { key: "godkanda", label: "Godkända", statuses: ["ACCEPTED", "BORROWED"], empty: "Här hamnar kontaktuppgifter när en förfrågan blir godkänd." },
  { key: "vantar", label: "Väntar", statuses: ["REQUESTED"], empty: "Inga förfrågningar väntar på svar." },
  { key: "avslutade", label: "Avslutade", statuses: ["RETURNED", "COMPLETED"], empty: "Inga avslutade lån än." },
];

// Gör om en förfrågan som väntar till samma form som en kontakt, utan telefon och e-post
function toWaitingContact(request, myRole) {
  return {
    request_id: request.id,
    status: request.status,
    item_name: request.item_name,
    my_role: myRole,
    contact_name: myRole === "BORROWER" ? request.owner_name : request.borrower_name,
    created_at: request.created_at,
  };
}

export default function Contacts() {
  const { token } = useAuth();
  // Ny key varje gång man trycker på Kontakter i menyn, även när man redan är här. Då hämtas listan på nytt,
  // t.ex. när man väntar på att en förfrågan ska bli godkänd.
  const { key: visit } = useLocation();
  const [tab, setTab] = useState("godkanda");
  const [contacts, setContacts] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // ökas av "Försök igen" så att listan hämtas på nytt

  useEffect(() => {
    let cancelled = false;
    setContacts(null);
    setError(null);

    Promise.all([getContacts(token), getMyBorrowRequests(token)])
      .then(([approved, { sent, received }]) => {
        if (cancelled) return;
        const waiting = [
          ...sent.map((request) => toWaitingContact(request, "BORROWER")),
          ...received.map((request) => toWaitingContact(request, "OWNER")),
        ]
          .filter((contact) => contact.status === "REQUESTED")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setContacts([...approved, ...waiting]);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token, attempt, visit]);

  const current = TABS.find((t) => t.key === tab);
  // Backend skickar nyast först, och den ordningen behålls inom fliken
  const shown = contacts && contacts.filter((contact) => current.statuses.includes(contact.status));

  return (
    <section className="page contacts">
      <div className="contacts-head">
        <h1 className="page-title-large">Kontakter</h1>
        <p className="muted">
          När en förfrågan godkänns hamnar kontaktuppgifterna här. Betalning sköter ni själva, till exempel med Swish.
        </p>
      </div>

      <div className="segmented" role="group" aria-label="Visa kontakter">
        {TABS.map((t) => (
          <button key={t.key} type="button" aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

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

      {!error && !shown && (
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

      {shown && shown.length === 0 && (
        <div className="message contacts-empty">
          <p>{current.empty}</p>
          {tab === "godkanda" && (
            <Link to="/" className="btn btn-secondary">
              Hitta något att låna
            </Link>
          )}
        </div>
      )}

      {shown && shown.length > 0 && (
        <ul className="contact-list">
          {shown.map((contact) => (
            <li key={contact.request_id}>
              <ContactCard contact={contact} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
