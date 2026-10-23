// En låneförfrågan (Figma: Ny förfrågan): saken, motparten med betyg, period och pris, motpartens omdömen
// och knapparna längst ned. Ägaren får bara knappar för de statusbyten som är tillåtna just nu
// (PUT /api/borrow-requests/:id, Projektplan 8.5–8.6). Lånaren ser status men byter den inte i v1.
// Backend har ingen GET för en enskild förfrågan, så den hämtas ur mina förfrågningar (GET /api/borrow-requests/my).
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RequestStatus from "../components/borrow/RequestStatus.jsx";
import { CONTACT_STATUSES, OWNER_ACTIONS, nextStepText } from "../components/borrow/status.js";
import { countDays, formatPeriod } from "../components/borrow/dates.js";
import { formatPrice } from "../components/items/formatPrice.js";
import { formatRating } from "../components/reviews/formatRating.js";
import ReviewList from "../components/reviews/ReviewList.jsx";
import Stars from "../components/reviews/Stars.jsx";
import Icon from "../components/common/Icon.jsx";
import TopBar from "../components/common/TopBar.jsx";
import ActionBar from "../components/common/ActionBar.jsx";
import { initials } from "../components/common/initials.js";
import { formatMonthYear } from "../components/common/formatDate.js";
import { getMyBorrowRequests, updateBorrowRequestStatus } from "../services/borrowRequestService.js";
import { getUser } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/items.css";
import "../assets/styles/dashboard.css";
import "../assets/styles/profile.css";

// Antal omdömen som visas innan man trycker "Visa alla"
const LATEST_REVIEWS = 3;

// "Eriks omdömen", men "Hans omdömen" när förnamnet redan slutar på s, x eller z
function reviewsHeading(name) {
  const firstName = name.split(" ")[0];
  return `${/[sxz]$/i.test(firstName) ? firstName : `${firstName}s`} omdömen`;
}

export default function BorrowingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const userId = user.id;

  const [request, setRequest] = useState(null);
  const [counterpart, setCounterpart] = useState(null); // motpartens publika profil med omdömen
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null); // status som håller på att sparas
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setRequest(null);
    setCounterpart(null);
    setShowAllReviews(false);
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
        // Ägaren ska kunna se lånarens omdömen innan beslut (Projektplan 8.4), och lånaren ser ägarens.
        // Går det fel visas bara namnet.
        const counterpartId = found.owner_id === userId ? found.borrower_id : found.owner_id;
        return getUser(counterpartId)
          .then((profile) => {
            if (!cancelled) setCounterpart(profile);
          })
          .catch(() => {});
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

  if (error || !request) {
    return (
      <section className="page request-details">
        <TopBar title="Förfrågan" onBack={handleBack} />
        {error ? (
          <p className="message message-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="muted">Hämtar förfrågan…</p>
        )}
      </section>
    );
  }

  const isOwner = request.owner_id === userId;
  const isNew = request.status === "REQUESTED";
  const name = isOwner ? request.borrower_name : request.owner_name;
  const heading = isOwner ? (isNew ? `${name} vill låna` : `Lånare: ${name}`) : `Uthyrare: ${name}`;
  // Neka och Avböj till vänster, som i designen
  const actions = isOwner ? [...(OWNER_ACTIONS[request.status] || [])].sort((a, b) => !!b.danger - !!a.danger) : [];
  const days = countDays(request.start_date, request.end_date);
  const reviews = counterpart?.reviews || [];

  return (
    <article className={"page request-details" + (actions.length > 0 ? " has-action-bar" : "")}>
      <TopBar title={isOwner && isNew ? "Ny förfrågan" : "Förfrågan"} onBack={handleBack} />

      <Link to={`/items/${request.item_id}`} className="card request-item">
        <span className="request-item-thumb" aria-hidden="true">
          <Icon name="camera" size={20} />
        </span>
        <span className="request-item-text">
          <span className="request-item-name">{request.item_name}</span>
          <span className="muted">{formatPrice(request.lending_price)}</span>
        </span>
        <RequestStatus status={request.status} />
      </Link>

      <div className="card request-person">
        <div className="person-card">
          <span className="avatar" aria-hidden="true">
            {initials(name)}
          </span>
          <div>
            <p className="person-name">{heading}</p>
            {counterpart && (
              <p className="rating-line">
                {counterpart.review_count > 0 && <Stars rating={counterpart.average_rating} />}
                {formatRating(counterpart)}
              </p>
            )}
          </div>
        </div>
        <dl className="info-rows request-rows">
          <div>
            <dt>{isNew ? "Önskad period" : "Period"}</dt>
            <dd>{formatPeriod(request.start_date, request.end_date)}</dd>
          </div>
          <div>
            <dt>Antal dagar</dt>
            <dd>{days}</dd>
          </div>
          <div>
            <dt>Totalt</dt>
            <dd className="request-total">{(days * Number(request.lending_price)).toLocaleString("sv-SE")} kr</dd>
          </div>
          {counterpart?.created_at && (
            <div>
              <dt>Medlem sedan</dt>
              <dd>{formatMonthYear(counterpart.created_at)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Ägaren med en ny förfrågan ser bara knapparna, alla andra får veta vad som händer härnäst */}
      {!(isOwner && isNew) && (
        <div className="info-box next-step">
          <p>{nextStepText(request.status, isOwner)}</p>
          {CONTACT_STATUSES.includes(request.status) && <Link to="/contacts">Visa kontaktuppgifter</Link>}
        </div>
      )}

      {counterpart && (
        <section className="request-reviews" aria-labelledby="counterpart-reviews">
          <div className="section-head">
            <h2 className="section-title" id="counterpart-reviews">
              {reviewsHeading(name)}
            </h2>
            {reviews.length > LATEST_REVIEWS && (
              <button type="button" className="link-button" onClick={() => setShowAllReviews(!showAllReviews)}>
                {showAllReviews ? "Visa färre" : "Visa alla"}
              </button>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="muted">Inga omdömen än.</p>
          ) : (
            <ReviewList reviews={showAllReviews ? reviews : reviews.slice(0, LATEST_REVIEWS)} variant="card" />
          )}
        </section>
      )}

      {actions.length > 0 && (
        <ActionBar
          message={
            actionError && (
              <p className="form-error" role="alert">
                {actionError}
              </p>
            )
          }
        >
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              className={"btn " + (action.danger ? "btn-danger-soft" : "btn-primary")}
              disabled={saving !== null}
              onClick={() => handleAction(action)}
            >
              {saving === action.status ? "Sparar…" : action.label}
            </button>
          ))}
        </ActionBar>
      )}
    </article>
  );
}
