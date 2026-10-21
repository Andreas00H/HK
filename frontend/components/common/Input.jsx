// Återanvändbart inmatningsfält: etikett ovanför och felmeddelande i röd text direkt under (UI.UX.md, Logga in / Registrera).
// hint är en grå hjälptext som visas när det inte finns något fel. Övriga props (type, value, onChange osv.) går till fältet.
// as="select" eller as="textarea" ger rullista eller flerradigt fält. Alternativen till en rullista skickas som children.
export default function Input({ id, label, error, hint, as = "input", ...props }) {
  const Field = as;
  const message = error || hint;
  const messageId = `${id}-message`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Field
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...props}
      />
      {message && (
        <p id={messageId} className={error ? "field-error" : "field-hint"}>
          {message}
        </p>
      )}
    </div>
  );
}
