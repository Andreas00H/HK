// Ett omdöme: namn, stjärnor, datum och kommentar (UI.UX.md 8.1).
// review kommer från GET /api/users/:id (fältet reviews) och har reviewer_name, rating, comment och created_at.
export default function ReviewCard({ review }) {
  const date = new Date(review.created_at);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  const dateText = date.toLocaleDateString("sv-SE", { day: "numeric", month: "short", ...(sameYear ? {} : { year: "numeric" }) });

  return (
    <article className="review">
      <p className="review-head">
        <strong>{review.reviewer_name}</strong>{" "}
        <span className="review-stars" role="img" aria-label={`Betyg ${review.rating} av 5`}>
          {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
        </span>{" "}
        <span className="muted">{dateText}</span>
      </p>
      {review.comment && <p className="review-comment">{review.comment}</p>}
    </article>
  );
}
