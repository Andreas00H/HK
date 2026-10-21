// Snittbetyg på svenskt sätt, t.ex. "★ 4,8 (12 omdömen)", eller "Inga omdömen än".
// profile är en publik profil från GET /api/users/:id.
export function formatRating(profile) {
  if (!(profile?.review_count > 0)) return "Inga omdömen än";
  const average = Number(profile.average_rating).toLocaleString("sv-SE", { maximumFractionDigits: 1 });
  return `★ ${average} (${profile.review_count} ${profile.review_count === 1 ? "omdöme" : "omdömen"})`;
}
