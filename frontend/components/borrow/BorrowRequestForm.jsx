// Låneförfrågan på annonsen: välj period och skicka med POST /api/borrow-requests. Visar beräknad hyra
// (dygnspris × antal dagar). Knappen ligger i den fasta raden längst ned (Figma), med summary till vänster.
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ActionBar from "../common/ActionBar.jsx";
import { createBorrowRequest } from "../../services/borrowRequestService.js";
import { countDays, todayString } from "./dates.js";

export default function BorrowRequestForm({ item, token, summary }) {
  const location = useLocation();
  const startRef = useRef(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(null); // den skickade förfrågan, för länken till den

  const today = todayString();
  const days = countDays(startDate, endDate);
  const total = days * Number(item.lending_price);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    if (!startDate || !endDate) {
      setError("Välj både från- och till-datum.");
      // Knappen sitter längst ned, så markören flyttas upp till datumen
      startRef.current?.focus();
      return;
    }
    if (endDate < startDate) {
      setError("Till-datum kan inte vara före från-datum.");
      startRef.current?.focus();
      return;
    }
    setStatus("sending");
    try {
      const created = await createBorrowRequest({ itemId: item.id, startDate, endDate }, token);
      setRequestId(created.id);
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <>
        <div className="card borrow-sent" role="status">
          <p>
            <strong>Förfrågan skickad!</strong> Ägaren får nu godkänna eller neka.
          </p>
        </div>
        <ActionBar summary={summary}>
          <Link to={`/borrow-requests/${requestId}`} className="btn btn-primary">
            Följ förfrågan
          </Link>
        </ActionBar>
      </>
    );
  }

  return (
    <form className="card borrow-form" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">Välj period</h2>

      <div className="date-row">
        <label>
          Från
          <input
            ref={startRef}
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
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

      <ActionBar summary={summary}>
        {token ? (
          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "Skickar…" : "Skicka förfrågan"}
          </button>
        ) : (
          // Efter inloggning kommer man tillbaka till annonsen. replace: inloggningen ersätter annonsen i historiken,
          // annars hamnar man på samma annons igen när man trycker Tillbaka efter inloggningen.
          <Link to="/login" replace state={{ from: location }} className="btn btn-primary">
            Logga in för att låna
          </Link>
        )}
      </ActionBar>
    </form>
  );
}
