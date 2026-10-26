// Profil (Figma: Profil, gruppens stil): knapp till Översikt, mina uppgifter, stad, omdömen och Logga ut.
// "Medlem sedan" och omdömen kommer från GET /api/users/:id. E-post och telefon kommer från inloggningen,
// eftersom profiler i API:t aldrig innehåller kontaktuppgifter (UI.UX.md 8.4).
// Backend kan inte spara stad än (ingen PUT för användare), så stadsbytet görs i CityContext och gäller
// tills sidan laddas om eller man loggar ut.
import { startTransition, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileInfo from "../components/profile/ProfileInfo.jsx";
import CitySelect from "../components/profile/CitySelect.jsx";
import ReviewList from "../components/reviews/ReviewList.jsx";
import Icon from "../components/common/Icon.jsx";
import { formatAverage } from "../components/reviews/formatRating.js";
import { getUser } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";
import { useCity } from "../hooks/useCity.js";
import { useBorrowRequests } from "../hooks/useBorrowRequests.js";
import "../assets/styles/forms.css";
import "../assets/styles/profile.css";

// Antal omdömen som visas innan man trycker "Visa alla omdömen"
const LATEST_REVIEWS = 2;

export default function Profile() {
  const { user, logout } = useAuth();
  const { city, setCity } = useCity();
  const { received } = useBorrowRequests();
  const navigate = useNavigate();
  const userId = user.id;

  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [chosenCity, setChosenCity] = useState(city);
  const [citySaved, setCitySaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUser(userId)
      .then((result) => {
        if (!cancelled) setProfile(result);
      })
      .catch((err) => {
        if (!cancelled) setProfileError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Röd siffra på knappen: förfrågningar på mina annonser som väntar på mitt svar
  const waiting = received.filter((request) => request.status === "REQUESTED").length;

  const createdAt = user.created_at || profile?.created_at;
  const reviews = profile?.reviews || [];

  function handleSaveCity(event) {
    event.preventDefault();
    setCity(chosenCity);
    setCitySaved(true);
  }

  // Till Hem efter utloggning. React Router byter sida i en transition, så utloggningen måste ligga i
  // samma transition. Annars hinner ProtectedRoute se att man är utloggad och skicka en till Logga in.
  function handleLogout() {
    startTransition(() => {
      logout();
      navigate("/", { replace: true });
    });
  }

  return (
    <section className="page profile">
      <h1 className="page-title page-header">Profil</h1>

      <Link to="/dashboard" className="btn btn-primary btn-block dashboard-link">
        <span>Mina annonser och förfrågningar</span>
        {waiting > 0 && (
          <span className="count-badge">
            {waiting}
            <span className="visually-hidden">{waiting === 1 ? " förfrågan väntar" : " förfrågningar väntar"} på ditt svar</span>
          </span>
        )}
        <Icon name="chevron-right" size={22} />
      </Link>

      <ProfileInfo
        name={user.name}
        email={user.email}
        phone={user.phone}
        memberSince={createdAt && new Date(createdAt).getFullYear()}
      />

      <form className="card" onSubmit={handleSaveCity}>
        <h2 className="section-title">Stad</h2>
        <div className="city-row">
          <CitySelect
            id="city"
            label="Visa annonser i"
            value={chosenCity}
            extraCities={[user.location]}
            onChange={(newCity) => {
              setChosenCity(newCity);
              setCitySaved(false);
            }}
          />
          <button type="submit" className="btn btn-secondary">
            Spara
          </button>
        </div>
        {citySaved ? (
          <p className="muted city-status" role="status">
            Sparat. Hem visar nu annonser i {city}.
          </p>
        ) : (
          <p className="muted city-status">Gäller tills du laddar om sidan eller loggar ut.</p>
        )}
      </form>

      <div className="card">
        <h2 className="section-title">Omdömen</h2>
        {profileError ? (
          <p className="form-error" role="alert">
            Kunde inte hämta omdömen. {profileError}
          </p>
        ) : !profile ? (
          <div className="skeleton-group" role="status">
            <span className="visually-hidden">Hämtar omdömen…</span>
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="muted">Inga omdömen än. De dyker upp efter ditt första avslutade lån.</p>
        ) : (
          <>
            <p className="rating-summary">
              <Icon name="star" size={28} className="star" />
              <strong>{formatAverage(profile.average_rating)}</strong>
              <span className="muted">
                ({profile.review_count} {profile.review_count === 1 ? "omdöme" : "omdömen"})
              </span>
            </p>
            <ReviewList reviews={showAllReviews ? reviews : reviews.slice(0, LATEST_REVIEWS)} />
            {reviews.length > LATEST_REVIEWS && (
              <button type="button" className="link-button" onClick={() => setShowAllReviews(!showAllReviews)}>
                {showAllReviews ? "Visa färre omdömen" : "Visa alla omdömen"}
              </button>
            )}
          </>
        )}
      </div>

      <button type="button" className="logout-link" onClick={handleLogout}>
        Logga ut
      </button>
    </section>
  );
}
