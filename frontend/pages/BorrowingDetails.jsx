// En låneförfrågan: sak, period, parter och status (UI.UX.md, Förfrågan). Ägaren får knappar för de statusbyten
// som är tillåtna just nu (PUT /api/borrow-requests/:id, Projektplan 8.5–8.6). Lånaren ser status men byter den inte i v1.
// Backend har ingen GET för en enskild förfrågan, så den hämtas ur mina förfrågningar (GET /api/borrow-requests/my).
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RequestStatus from "../components/borrow/RequestStatus.jsx";
import { CONTACT_STATUSES, OWNER_ACTIONS, nextStepText } from "../components/borrow/status.js";
import { countDays, formatPeriod } from "../components/borrow/dates.js";
import { formatPrice } from "../components/items/formatPrice.js";
import { formatRating } from "../components/reviews/formatRating.js";
import { getMyBorrowRequests, updateBorrowRequestStatus } from "../services/borrowRequestService.js";
import { getUser } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/items.css";
import "../assets/styles/dashboard.css";

export default function BorrowingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const userId = user.id;

  const [request, setRequest] = useState(null);
  const [borrower, setBorrower] = useState(null); // lånarens publika profil med snittbetyg, hämtas bara för ägaren
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null); // status som håller på att sparas
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setRequest(null);
    setBorrower(null);
    setError(null);
    setActionError(null);

    getMyBorrowRequests(token)
      .then(({ sent, received }) => {
        if (cancelled) return;
        const found = [...received, ...sent].find((row) => row.id === Number(id));
        if (!found) {
          setError("Förfrågan finns inte, eller så är du inte part i den.");
          return;
        }
        setRequest(found);
        // Ägaren ska kunna se lånarens omdömen innan beslut (Projektplan 8.4). Går det fel visas bara namnet.
        if (found.owner_id === userId) {
          return getUser(found.borrower_id)
            .then((profile) => {
              if (!cancelled) setBorrower(profile);
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        if (!cancelled) setError(`Kunde inte hämta förfrågan. ${err.message}`);
      });

    return () => {
      cancelled = true;
    };
  }, [id, token, userId]);

  // Tillbaka till förra sidan i appen. Har sidan öppnats via en länk finns ingen, då går vi till Översikt.
  // React Router numrerar sidorna i webbläsarens historik (idx), där 0 är första sidan i appen.
  function handleBack() {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/dashboard");
  }

  async function handleAction(action) {
    // Nekad går inte att ändra tillbaka, därför frågar vi först
    if (action.status === "DECLINED" && !window.confirm("Vill du neka förfrågan? Det går inte att ångra.")) return;

    setSaving(action.status);
    setActionError(null);
    try {
      const updated = await updateBorrowRequestStatus(request.id, action.status, token);
      // Svaret saknar sakens namn och parternas namn, så bara statusen byts ut
      setRequest((current) => ({ ...current, status: updated.status }));
    } catch (err) {
      // 409 = statusen har redan ändrats, t.ex. i en annan flik
      setActionError(
        err.status === 409 ? "Förfrågan har redan ändrats. Ladda om sidan för att se aktuell status." : err.message
      );
    } finally {
      setSaving(null);
    }
  }

  const topBar = (
    <div className="details-topbar">
      <button type="button" className="back-link" onClick={handleBack}>
        ← Tillbaka
      </button>
    </div>
  );

  if (error) {
    return (
      <section className="page request-details">
        {topBar}
        <p className="message message-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!request) {
    return (
      <section className="page request-details">
        {topBar}
        <p className="muted">Hämtar förfrågan…</p>
      </section>
    );
  }

  const isOwner = request.owner_id === userId;
  const actions = isOwner ? OWNER_ACTIONS[request.status] || [] : [];
  const days = countDays(request.start_date, request.end_date);

  return (
    <article className="page request-details">
      {topBar}

      <div className="card">
        <div className="details-title-row">
          <h1 className="page-title">{request.item_name}</h1>
          <RequestStatus status={request.status} />
        </div>
        <Link to={`/items/${request.item_id}`}>Visa annonsen</Link>
      </div>

      <dl className="card info-rows">
        <div>
          <dt>Period</dt>
          <dd>{formatPeriod(request.start_date, request.end_date)}</dd>
        </div>
        <div>
          <dt>Dygnspris</dt>
          <dd>{formatPrice(request.lending_price)}</dd>
        </div>
        <div>
          <dt>
            Beräknad hyra ({days} {days === 1 ? "dag" : "dagar"})
          </dt>
          <dd>{(days * Number(request.lending_price)).toLocaleString("sv-SE")} kr</dd>
        </div>
        <div>
          <dt>Ägare</dt>
          <dd>
            {request.owner_name}
            {isOwner && " (du)"}
          </dd>
        </div>
        <div>
          <dt>Lånare</dt>
          <dd>
            {request.borrower_name}
            {!isOwner && " (du)"}
          </dd>
        </div>
        {isOwner && borrower && (
          <div>
            <dt>Lånarens omdömen</dt>
            <dd>{formatRating(borrower)}</dd>
          </div>
        )}
      </dl>

      <div className="card next-step">
        <p>{nextStepText(request.status, isOwner)}</p>
        {CONTACT_STATUSES.includes(request.status) && <Link to="/contacts">Visa kontaktuppgifter</Link>}
      </div>

      {actions.length > 0 && (
        <div className="request-actions">
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              className={"btn btn-block " + (action.danger ? "btn-danger" : "btn-primary")}
              disabled={saving !== null}
              onClick={() => handleAction(action)}
            >
              {saving === action.status ? "Sparar…" : action.label}
            </button>
          ))}
          {actionError && (
            <p className="form-error" role="alert">
              {actionError}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
