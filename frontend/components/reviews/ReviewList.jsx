// Lista med omdömen, i den ordning de kommer från backend (nyast först). variant skickas vidare till ReviewCard:
// "card" som egna kort (Förfrågan) eller "row" som rader med linje emellan (Profil).
import ReviewCard from "./ReviewCard.jsx";

export default function ReviewList({ reviews, variant = "row" }) {
  return (
    <ul className={`review-list review-list-${variant}`}>
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
