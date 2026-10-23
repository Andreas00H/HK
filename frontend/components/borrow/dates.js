// Datum för låneperioder. Backend skickar och tar emot datum som text i formatet ÅÅÅÅ-MM-DD.
import { shortMonth, toDate } from "../common/formatDate.js";

// Dagens datum som ÅÅÅÅ-MM-DD (lokal tid, så att det blir rätt dag i Sverige)
export function todayString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

// Antal dagar i perioden, där både första och sista dagen räknas (Figma: "28 sep till 2 okt" är 5 dagar).
// Samma dag blir alltså 1 dag.
export function countDays(start, end) {
  if (!start || !end || end < start) return 0;
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
  return Math.round(diff) + 1;
}

// Perioden som i designen, t.ex. "28 sep till 2 okt". Året skrivs bara ut när det inte är i år,
// och på båda datumen om perioden går över ett årsskifte.
export function formatPeriod(start, end) {
  const startDate = toDate(start);
  const endDate = toDate(end);
  const crossesYear = startDate.getFullYear() !== endDate.getFullYear();
  const endYear = crossesYear || endDate.getFullYear() !== new Date().getFullYear();
  const text = (date, withYear) => `${date.getDate()} ${shortMonth(date)}${withYear ? ` ${date.getFullYear()}` : ""}`;

  if (start === end) return text(endDate, endYear);
  return `${text(startDate, crossesYear)} till ${text(endDate, endYear)}`;
}
