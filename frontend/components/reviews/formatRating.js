// Snittbetyg som i designen, t.ex. "4,8 · 12 omdömen", eller "Inga omdömen än".
// profile är en publik profil från GET /api/users/:id.
export function formatRating(profile) {
  if (!(profile?.review_count > 0)) return "Inga omdömen än";
  const count = profile.review_count;
  return `${formatAverage(profile.average_rating)} · ${count} ${count === 1 ? "omdöme" : "omdömen"}`;
}

// Snittbetyg med en decimal och komma, t.ex. "4,6"
export function formatAverage(average) {
  return Number(average).toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
