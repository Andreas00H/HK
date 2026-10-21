// Formulär för att begära lån under ett datumintervall. Visar beräknad hyra (dygnspris × antal dagar).
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createBorrowRequest } from "../../services/borrowRequestService.js";

// Dagens datum som ÅÅÅÅ-MM-DD (lokal tid, så att det blir rätt dag i Sverige)
function todayString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

// Antal dagar mellan två datum. Samma dag räknas som 1 dag.
function countDays(start, end) {
  if (!start || !end || end < start) return 0;
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diff));
}

export default function BorrowRequestForm({ item, token }) {
  const location = useLocation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null);

  const today = todayString();
  const days = countDays(startDate, endDate);
  const total = days * Number(item.lending_price);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    if (!startDate || !endDate) {
      setError("Välj både från- och till-datum.");
      return;
    }
    if (endDate < startDate) {
      setError("Till-datum kan inte vara före från-datum.");
      return;
    }
    setStatus("sending");
    try {
      await createBorrowRequest({ itemId: item.id, startDate, endDate }, token);
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="card borrow-sent" role="status">
        <p>
          <strong>Förfrågan skickad!</strong> Ägaren får nu godkänna eller neka. Du ser status under
          Profil → Mina annonser &amp; förfrågningar.
        </p>
      </div>
    );
  }

  return (
    <form className="card borrow-form" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">Välj period</h2>

      <div className="date-row">
        <label>
          Från
          <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          Till
          <input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>

      {days > 0 && (
        <p className="rent-total">
          <span className="muted">
            Beräknad hyra ({days} {days === 1 ? "dag" : "dagar"})
          </span>
          <strong>{total.toLocaleString("sv-SE")} kr</strong>
        </p>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {token ? (
        <button type="submit" className="btn btn-primary btn-block" disabled={status === "sending"}>
          {status === "sending" ? "Skickar…" : "Skicka låneförfrågan"}
        </button>
      ) : (
        // Efter inloggning kommer man tillbaka till annonsen. replace: inloggningen ersätter annonsen i historiken,
        // annars hamnar man på samma annons igen när man trycker Tillbaka efter inloggningen.
        <Link to="/login" replace state={{ from: location }} className="btn btn-primary btn-block">
          Logga in för att skicka förfrågan
        </Link>
      )}
      <p className="muted center">Betalning och upphämtning sköter ni själva efter godkännande.</p>
    </form>
  );
}
