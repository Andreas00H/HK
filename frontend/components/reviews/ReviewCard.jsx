// Ett omdöme. review kommer från GET /api/users/:id (fältet reviews) och har reviewer_name, rating, comment och created_at.
// variant="card": eget kort med stjärnor, kommentar och "Johan K. · aug 2026" (Figma: Ny förfrågan).
// variant="row": en rad med namn, stjärnor och datum och kommentaren under (Figma: Profil).
import Stars from "./Stars.jsx";
import { formatDayMonth, formatMonthYear } from "../common/formatDate.js";

export default function ReviewCard({ review, variant = "row" }) {
  if (variant === "card") {
    return (
      <article className="card review review-card">
        <Stars rating={review.rating} size={18} />
        {review.comment && <p>{review.comment}</p>}
        <p className="muted">
          {review.reviewer_name} · {formatMonthYear(review.created_at)}
        </p>
      </article>
    );
  }

  return (
    <article className="review review-row">
      <p className="review-head">
        <span className="review-name">{review.reviewer_name}</span>
        <Stars rating={review.rating} size={14} />
        <span className="muted">{formatDayMonth(review.created_at)}</span>
      </p>
      {review.comment && <p>{review.comment}</p>}
    </article>
  );
}
