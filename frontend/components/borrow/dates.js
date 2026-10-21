// Datum för låneperioder. Backend skickar och tar emot datum som text i formatet ÅÅÅÅ-MM-DD.

// Dagens datum som ÅÅÅÅ-MM-DD (lokal tid, så att det blir rätt dag i Sverige)
export function todayString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

// Antal dagar mellan två datum. Samma dag räknas som 1 dag.
export function countDays(start, end) {
  if (!start || !end || end < start) return 0;
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diff));
}

// Gör om ÅÅÅÅ-MM-DD till ett datum i lokal tid (new Date("ÅÅÅÅ-MM-DD") räknas som UTC)
function toLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Perioden på svenska, t.ex. "20 okt. – 22 okt. 2026". Året skrivs bara en gång om det är samma.
export function formatPeriod(start, end) {
  const startDate = toLocalDate(start);
  const endDate = toLocalDate(end);
  const withYear = { day: "numeric", month: "short", year: "numeric" };
  const endText = endDate.toLocaleDateString("sv-SE", withYear);
  if (start === end) return endText;

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startText = startDate.toLocaleDateString("sv-SE", sameYear ? { day: "numeric", month: "short" } : withYear);
  return `${startText} – ${endText}`;
}
