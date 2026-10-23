// Kort för en kontakt (Figma: Kontakter): initialer, namn, roll och sak, status och telefon och e-post med Kopiera.
// Telefon och e-post är också länkar (tel: och mailto:). En förfrågan som väntar har inga kontaktuppgifter än.
// contact har samma fält som GET /api/contacts: request_id, status, item_name, my_role, contact_name,
// contact_phone och contact_email.
import { useState } from "react";
import RequestStatus from "../borrow/RequestStatus.jsx";
import Icon from "../common/Icon.jsx";
import { initials } from "../common/initials.js";

export default function ContactCard({ contact }) {
  const [copied, setCopied] = useState(null); // "phone" eller "email" en kort stund efter Kopiera

  async function copy(kind, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied((current) => (current === kind ? null : current)), 2000);
    } catch {
      // Webbläsaren tillät inte kopiering. Numret och adressen syns ändå.
    }
  }

  // tel: fungerar bäst utan mellanslag och bindestreck
  const rows = [
    contact.contact_phone && {
      kind: "phone",
      icon: "phone",
      value: contact.contact_phone,
      href: `tel:${contact.contact_phone.replace(/[^\d+]/g, "")}`,
      label: "telefonnumret",
    },
    contact.contact_email && {
      kind: "email",
      icon: "mail",
      value: contact.contact_email,
      href: `mailto:${contact.contact_email}`,
      label: "e-postadressen",
    },
  ].filter(Boolean);

  return (
    <article className="card contact-card">
      <div className="contact-card-top">
        <span className="avatar" aria-hidden="true">
          {initials(contact.contact_name)}
        </span>
        <div className="contact-card-who">
          <h2 className="contact-name">{contact.contact_name}</h2>
          <p className="muted">
            {contact.my_role === "BORROWER" ? "Hyr ut" : "Lånar"} · {contact.item_name}
          </p>
        </div>
        <RequestStatus status={contact.status} />
      </div>

      {contact.status === "REQUESTED" ? (
        <p className="muted">Kontaktuppgifterna visas när förfrågan godkänns.</p>
      ) : (
        rows.map((row) => (
          <div key={row.kind} className="contact-row">
            <Icon name={row.icon} size={20} />
            <a href={row.href}>{row.value}</a>
            <button type="button" className="link-button" onClick={() => copy(row.kind, row.value)}>
              {copied === row.kind ? "Kopierat" : "Kopiera"}
              <span className="visually-hidden"> {row.label}</span>
            </button>
          </div>
        ))
      )}
    </article>
  );
}
