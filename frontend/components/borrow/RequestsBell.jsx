// Klockan på Hem (Figma). Leder till Mina annonser och förfrågningar och har en röd prick när förfrågningar
// på mina annonser väntar på svar. Visas bara för inloggade.
import { Link } from "react-router-dom";
import Icon from "../common/Icon.jsx";
import { useBorrowRequests } from "../../hooks/useBorrowRequests.js";

export default function RequestsBell() {
  const { received } = useBorrowRequests();
  const waiting = received.filter((request) => request.status === "REQUESTED").length;
  const label =
    "Mina annonser och förfrågningar" +
    (waiting > 0 ? `, ${waiting} ${waiting === 1 ? "förfrågan väntar" : "förfrågningar väntar"} på svar` : "");

  return (
    <Link to="/dashboard" className="icon-button bell" aria-label={label}>
      <Icon name="bell" />
      {waiting > 0 && <span className="bell-dot" />}
    </Link>
  );
}
