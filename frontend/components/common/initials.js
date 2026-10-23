// Initialer till avatarer, t.ex. "Anna Ägare" blir "AÄ" och "Erik S." blir "ES". Ett ord ger en bokstav.
export function initials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (words[0][0] + last).toUpperCase();
}
