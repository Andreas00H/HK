// Kort för en förfrågan i en lista, t.ex. i Översikt: sak, period, motpart och statusbadge (UI.UX.md, Översikt).
// Gäller förfrågan min annons visas även vad jag kan göra härnäst. Hela kortet leder till förfrågan,
// där knapparna för statusbyte finns.
import { Link } from "react-router-dom";
import RequestStatus from "./RequestStatus.jsx";
import { OWNER_ACTIONS } from "./status.js";
import { formatPeriod } from "./dates.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function RequestCard({ request }) {
  const { user } = useAuth();
  const isOwner = user?.id === request.owner_id;
  const actions = isOwner ? OWNER_ACTIONS[request.status] || [] : [];

  return (
    <Link to={`/borrow-requests/${request.id}`} className="card request-card">
      <div className="request-card-top">
        <h2 className="request-card-title">{request.item_name}</h2>
        <RequestStatus status={request.status} />
      </div>
      <p className="muted">{formatPeriod(request.start_date, request.end_date)}</p>
      <p>{isOwner ? `Lånare: ${request.borrower_name}` : `Ägare: ${request.owner_name}`}</p>
      {actions.length > 0 && (
        <p className="request-card-todo">
          Att göra: {actions.map((action) => action.label.toLowerCase()).join(" eller ")}
        </p>
      )}
    </Link>
  );
}
