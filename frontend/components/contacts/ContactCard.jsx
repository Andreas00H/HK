// Kort för en kontakt (UI.UX.md 8.2): motpartens namn och status, vilken sak det gäller, period, telefon och e-post.
// Ring och Mejla öppnar telefonen eller e-postprogrammet. Saknas ett av fälten döljs den knappen och den andra tar hela bredden.
// contact kommer från GET /api/contacts.
import { Link } from "react-router-dom";
import RequestStatus from "../borrow/RequestStatus.jsx";
import { formatPeriod } from "../borrow/dates.js";

// Små ikoner framför telefon och e-post
const ICONS = {
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  mail: "M3 6h18v12H3z M3 6l9 7 9-7",
};

function ContactIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export default function ContactCard({ contact }) {
  // tel: fungerar bäst utan mellanslag och bindestreck
  const phoneHref = contact.contact_phone ? `tel:${contact.contact_phone.replace(/[^\d+]/g, "")}` : null;
  const emailHref = contact.contact_email ? `mailto:${contact.contact_email}` : null;

  return (
    <article className="card contact-card">
      <div className="contact-card-top">
        <span className="avatar" aria-hidden="true">
          {contact.contact_name.charAt(0).toUpperCase()}
        </span>
        <h2 className="contact-name">{contact.contact_name}</h2>
        <RequestStatus status={contact.status} />
      </div>

      <p>
        {contact.my_role === "BORROWER" ? "Du lånar: " : "Lånar av dig: "}
        <Link to={`/borrow-requests/${contact.request_id}`}>{contact.item_name}</Link>
      </p>
      <p className="muted">{formatPeriod(contact.start_date, contact.end_date)}</p>

      {phoneHref && (
        <a className="contact-line" href={phoneHref}>
          <ContactIcon name="phone" />
          {contact.contact_phone}
        </a>
      )}
      {emailHref && (
        <a className="contact-line" href={emailHref}>
          <ContactIcon name="mail" />
          {contact.contact_email}
        </a>
      )}

      {(phoneHref || emailHref) && (
        <div className="contact-actions">
          {phoneHref && (
            <a className="btn btn-primary" href={phoneHref}>
              Ring
            </a>
          )}
          {emailHref && (
            <a className="btn btn-secondary" href={emailHref}>
              Mejla
            </a>
          )}
        </div>
      )}
    </article>
  );
}
