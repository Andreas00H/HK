// Fem stjärnor där betyget är ifyllt i gult och resten grått (Figma). Snittbetyg avrundas till hela stjärnor.
// Skärmläsare får betyget som text.
import Icon from "../common/Icon.jsx";

export default function Stars({ rating, size = 16 }) {
  const filled = Math.round(Number(rating));
  const label = Number(rating).toLocaleString("sv-SE", { maximumFractionDigits: 1 });

  return (
    <span className="stars" role="img" aria-label={`Betyg ${label} av 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={size} className={n <= filled ? "star" : "star-empty"} />
      ))}
    </span>
  );
}
