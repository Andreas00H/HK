// Statusbadge för en förfrågan, t.ex. "Väntar" eller "Utlånad" (UI.UX.md 4.5). Status visas alltid med text, inte bara färg.
import { STATUS_LABELS } from "./status.js";

export default function RequestStatus({ status }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{STATUS_LABELS[status] || status}</span>;
}
