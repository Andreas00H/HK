// Annons (Figma): stor bild med Tillbaka och Dela, rubrik, dygnspris, plats, uppgifter, beskrivning och ägaren.
// Längst ned en fast rad med priset och knappen för låneförfrågan. Ägaren ser "Redigera annons" i stället.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getItem } from "../services/itemService.js";
import { getUser } from "../services/userService.js";
import { formatPrice } from "../components/items/formatPrice.js";
import { formatRating } from "../components/reviews/formatRating.js";
import { formatDate } from "../components/common/formatDate.js";
import { initials } from "../components/common/initials.js";
import Icon from "../components/common/Icon.jsx";
import TopBar from "../components/common/TopBar.jsx";
import ActionBar from "../components/common/ActionBar.jsx";
import BorrowRequestForm from "../components/borrow/BorrowRequestForm.jsx";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/items.css";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState(null);
  const [brokenImage, setBrokenImage] = useState(false);
  const [shareNote, setShareNote] = useState(null);

  // Utloggad: knappen leder till Logga in. Ägaren ser "Redigera annons" i stället för förfrågan.
  const { token, user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    setItem(null);
    setOwner(null);
    setError(null);
    setBrokenImage(false);

    getItem(id)
      .then((result) => {
        if (cancelled) return;
        setItem(result);
        // Ägarens publika profil ger snittbetyget. Går det fel visas bara namnet.
        return getUser(result.owner_id).then((profile) => {
          if (!cancelled) setOwner(profile);
        }).catch(() => {});
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Tillbaka till förra sidan i appen. Har annonsen öppnats via en delad länk finns ingen, då går vi till Hem.
  // React Router numrerar sidorna i webbläsarens historik (idx), där 0 är första sidan i appen.
  function handleBack() {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  }

  // Dela-knappen: telefonens dela-meny om den finns, annars kopieras länken
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareNote("Länken är kopierad");
        setTimeout(() => setShareNote(null), 2000);
      }
    } catch {
      // Användaren avbröt delningen, inget att göra
    }
  }

  if (error || !item) {
    return (
      <section className="page">
        <TopBar onBack={handleBack} />
        {error ? (
          <p className="message message-error" role="alert">
            Kunde inte hämta annonsen. {error}
          </p>
        ) : (
          <p className="muted">Hämtar annonsen…</p>
        )}
      </section>
    );
  }

  const isOwner = user && user.id === item.owner_id;
  const ownerName = owner?.name || item.owner_name;
  const priceSummary = (
    <>
      <strong>{formatPrice(item.lending_price)}</strong>
      <span className="muted">Betalas till uthyraren</span>
    </>
  );

  return (
    <article className="page item-details has-action-bar">
      <div className="details-hero">
        {item.image_url && !brokenImage ? (
          <img src={item.image_url} alt={item.name} onError={() => setBrokenImage(true)} />
        ) : (
          <Icon name="camera" size={40} />
        )}
        <button type="button" className="icon-button hero-back" onClick={handleBack} aria-label="Tillbaka">
          <Icon name="chevron-left" />
        </button>
        <button type="button" className="icon-button hero-share" onClick={handleShare} aria-label="Dela annonsen">
          <Icon name="share" size={20} />
        </button>
      </div>

      {shareNote && (
        <p className="muted" role="status">
          {shareNote}
        </p>
      )}

      <div className="details-head">
        <div className="details-title-row">
          <h1 className="details-title">{item.name}</h1>
          {item.available ? (
            <span className="badge badge-available">Ledig</span>
          ) : (
            <span className="badge badge-returned">Inte tillgänglig</span>
          )}
        </div>
        <div className="details-price-row">
          <p className="details-price">
            <strong>{Number(item.lending_price).toLocaleString("sv-SE")} kr</strong> per dag
          </p>
          {/* Handpenning visas bara om ägaren har fyllt i den (UI.UX.md, Annonsdetaljer) */}
          {item.deposit > 0 && (
            <p className="muted details-deposit">Handpenning {Number(item.deposit).toLocaleString("sv-SE")} kr</p>
          )}
        </div>
        {/* Stadsdel före staden, som i Figma: "Vasastan, Stockholm" */}
        <p className="details-location">
          <Icon name="pin" size={18} />
          {item.area ? `${item.area}, ${item.location}` : item.location}
        </p>
      </div>

      <dl className="card info-rows details-info">
        <div>
          <dt>
            <Icon name="calendar" size={20} />
            Upplagd
          </dt>
          <dd>{formatDate(item.created_at)}</dd>
        </div>
        <div>
          <dt>
            <Icon name="check" size={20} />
            Skick
          </dt>
          <dd>{item.condition}</dd>
        </div>
        <div>
          <dt>
            <Icon name="chevron-right" size={20} />
            Kategori
          </dt>
          <dd>{item.category_name}</dd>
        </div>
      </dl>

      <section className="details-section">
        <h2 className="section-title">Beskrivning</h2>
        <p className="description">{item.description}</p>
      </section>

      <div className="card person-card">
        <span className="avatar" aria-hidden="true">
          {initials(ownerName)}
        </span>
        <div>
          <p className="person-name">{ownerName}</p>
          {owner && (
            <p className="rating-line">
              {owner.review_count > 0 && <Icon name="star" size={16} className="star" />}
              {formatRating(owner)}
            </p>
          )}
        </div>
      </div>

      {isOwner ? (
        <ActionBar summary={priceSummary}>
          <Link to={`/items/${item.id}/edit`} className="btn btn-primary">
            Redigera annons
          </Link>
        </ActionBar>
      ) : item.available ? (
        <BorrowRequestForm item={item} token={token} summary={priceSummary} />
      ) : (
        <ActionBar summary={priceSummary}>
          <button type="button" className="btn btn-primary" disabled>
            Inte tillgänglig
          </button>
        </ActionBar>
      )}
    </article>
  );
}
