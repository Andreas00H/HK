// Lista med omdömen, i den ordning de kommer från backend (nyast först). Används på Profil och på en förfrågan.
import ReviewCard from "./ReviewCard.jsx";

export default function ReviewList({ reviews }) {
  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}
