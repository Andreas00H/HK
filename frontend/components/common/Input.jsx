// Återanvändbart inmatningsfält: etikett ovanför och felmeddelande i röd text direkt under.
// hint är en grå hjälptext som visas när det inte finns något fel. Övriga props (type, value, onChange osv.) går till fältet.
// as="select" eller as="textarea" ger rullista eller flerradigt fält. Alternativen till en rullista skickas som children.
// suffix är text som står inne i fältet till höger, t.ex. "kr per dag".
export default function Input({ id, label, error, hint, as = "input", suffix, ...props }) {
  const Field = as;
  const message = error || hint;
  const messageId = `${id}-message`;

  const field = (
    <Field
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={message ? messageId : undefined}
      {...props}
    />
  );

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {suffix ? (
        <div className="input-suffix">
          {field}
          <span aria-hidden="true">{suffix}</span>
        </div>
      ) : (
        field
      )}
      {message && (
        <p id={messageId} className={error ? "field-error" : "field-hint"}>
          {message}
        </p>
      )}
    </div>
  );
}
