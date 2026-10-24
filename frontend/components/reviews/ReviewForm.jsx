// Formulär för att lämna omdöme efter avslutad uthyrning. Ingen logik ännu.
// Formulär för att lämna omdöme efter avslutad uthyrning (Projektplan 8.7).
// Betyget är ett heltal 1–5, kommentaren är valfri (max 1000 tecken, samma gräns som backend).
import { useState } from "react";
import { createReview } from "../../services/reviewService.js";

export default function ReviewForm({ borrowingId, token, otherName, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Välj ett betyg mellan 1 och 5.");
      return;
    }
    setStatus("sending");
    try {
      await createReview({ borrowingId, rating, comment: comment.trim() }, token);
      setStatus("sent");
      if (onSubmitted) onSubmitted();
    } catch (err) {
      // 409 = omdöme redan lämnat för det här lånet, då är formuläret inte längre aktuellt
      if (err.status === 409) {
        setStatus("sent");
        return;
      }
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="card" role="status">
        <p>
          <strong>Tack!</strong> Ditt omdöme är sparat.
        </p>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">Lämna omdöme{otherName ? ` om ${otherName}` : ""}</h2>

      <fieldset>
        <legend>Betyg</legend>
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="rating"
              value={value}
              checked={rating === value}
              onChange={() => setRating(value)}
            />{" "}
            {value}
          </label>
        ))}
      </fieldset>

      <div className="field">
        <label htmlFor="review-comment">Kommentar (valfri)</label>
        <textarea
          id="review-comment"
          rows={3}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-block" disabled={status === "sending"}>
        {status === "sending" ? "Sparar…" : "Skicka omdöme"}
      </button>
    </form>
  );
}