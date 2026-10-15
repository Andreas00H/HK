// Annonsdetaljer: bild, dygnspris, info, beskrivning, ägare och låneförfrågan (UI.UX.md, Annonsdetaljer).
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getItem } from "../services/itemService.js";
import { getUser } from "../services/userService.js";
import { formatPrice } from "../components/items/formatPrice.js";
import { useAuth } from "../hooks/useAuth.js";
import BorrowRequestForm from "../components/borrow/BorrowRequestForm.jsx";
import "../assets/styles/items.css";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Utloggad: knappen leder till Logga in. Ägaren ser "Redigera annons" i stället för förfrågan.
  const { token, user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    setItem(null);
    setOwner(null);
    setError(null);

    getItem(id)
      .then((result) => {
        if (cancelled) return;
        setItem(result);
        // Ägarens publika profil ger snittbetyg och "medlem sedan". Går det fel visas bara namnet.
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

  // Dela-knappen: telefonens dela-meny om den finns, annars kopieras länken
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Användaren avbröt delningen, inget att göra
    }
  }

  const topBar = (
    <div className="details-topbar">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Tillbaka
      </button>
      {item && (
        <button type="button" className="icon-btn" onClick={handleShare} aria-label="Dela annonsen">
          {copied ? "Länk kopierad" : "Dela"}
        </button>
      )}
    </div>
  );

  if (error) {
    return (
      <section className="page">
        {topBar}
        <p className="message message-error" role="alert">
          Kunde inte hämta annonsen. {error}
        </p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="page">
        {topBar}
        <p className="muted">Hämtar annonsen…</p>
      </section>
    );
  }

  const isOwner = user && user.id === item.owner_id;
  const ownerName = owner?.name || item.owner_name;

  return (
    <article className="page item-details">
      {topBar}

      <div className="details-image">
        {item.image_url ? <img src={item.image_url} alt={item.name} /> : <span className="item-card-noimage">Ingen bild</span>}
      </div>

      <div className="card">
        <div className="details-title-row">
          <h1 className="page-title">{item.name}</h1>
          {item.available ? (
            <span className="badge badge-available">Ledig</span>
          ) : (
            <span className="badge badge-returned">Inte tillgänglig</span>
          )}
        </div>
        <p className="details-price">{formatPrice(item.lending_price)}</p>
      </div>

      <dl className="card info-rows">
        <div>
          <dt>Kategori</dt>
          <dd>{item.category_name}</dd>
        </div>
        <div>
          <dt>Skick</dt>
          <dd>{item.condition}</dd>
        </div>
        <div>
          <dt>Stad</dt>
          <dd>{item.location}</dd>
        </div>
      </dl>

      <div className="card">
        <h2 className="section-title">Beskrivning</h2>
        <p className="description">{item.description}</p>
      </div>

      <div className="card owner-box">
        <span className="avatar" aria-hidden="true">
          {ownerName?.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="owner-name">{ownerName}</p>
          <p className="muted">
            {owner?.review_count > 0
              ? `★ ${Number(owner.average_rating).toLocaleString("sv-SE", { maximumFractionDigits: 1 })} (${owner.review_count} ${owner.review_count === 1 ? "omdöme" : "omdömen"})`
              : "Inga omdömen än"}
            {owner?.created_at && ` · Medlem sedan ${new Date(owner.created_at).getFullYear()}`}
          </p>
        </div>
      </div>

      {isOwner ? (
        <Link to={`/items/${item.id}/edit`} className="btn btn-secondary btn-block">
          Redigera annons
        </Link>
      ) : item.available ? (
        <BorrowRequestForm item={item} token={token} />
      ) : (
        <p className="message">Saken är inte tillgänglig för utlåning just nu.</p>
      )}
    </article>
  );
}
