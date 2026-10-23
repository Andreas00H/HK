// Datum på svenska som i designen, utan punkt efter månaden: "24 sep 2026", "3 okt" och "mars 2025".
// Tar emot både ÅÅÅÅ-MM-DD (DATE från backend) och tidsstämplar (created_at).

// ÅÅÅÅ-MM-DD räknas som lokal tid. new Date("ÅÅÅÅ-MM-DD") tolkas annars som UTC och kan bli fel dag.
export function toDate(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

// Kort månadsnamn, t.ex. "sep", "okt" och "mars"
export function shortMonth(date) {
  return date.toLocaleDateString("sv-SE", { month: "short" }).replace(".", "");
}

// "24 sep 2026"
export function formatDate(value) {
  const date = toDate(value);
  return `${date.getDate()} ${shortMonth(date)} ${date.getFullYear()}`;
}

// "3 okt", med år om det inte är i år
export function formatDayMonth(value) {
  const date = toDate(value);
  const year = date.getFullYear() === new Date().getFullYear() ? "" : ` ${date.getFullYear()}`;
  return `${date.getDate()} ${shortMonth(date)}${year}`;
}

// "mars 2025"
export function formatMonthYear(value) {
  const date = toDate(value);
  return `${shortMonth(date)} ${date.getFullYear()}`;
}
