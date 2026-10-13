// Visar dygnspriset på svenskt sätt, t.ex. "50 kr/dag" eller "1 200 kr/dag".
export function formatPrice(price) {
  return `${Number(price).toLocaleString("sv-SE")} kr/dag`;
}
