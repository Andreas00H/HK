// Översikt (UI.UX.md, Översikt): flikarna Mottagna, Skickade och Mina annonser. Data från GET /api/dashboard.
// Varje förfrågan leder till sin sida, där ägaren byter status. Fliken sparas i adressen (?flik=skickade),
// så att Tillbaka från en förfrågan kommer till samma flik.
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RequestCard from "../components/borrow/RequestCard.jsx";
import ItemList from "../components/items/ItemList.jsx";
import { getDashboard } from "../services/dashboardService.js";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/items.css";
import "../assets/styles/dashboard.css";

const TABS = [
  { key: "mottagna", label: "Mottagna" },
  { key: "skickade", label: "Skickade" },
  { key: "annonser", label: "Mina annonser" },
];

// Lista med förfrågningar, eller en text om listan är tom
function RequestList({ requests, empty }) {
  if (requests.length === 0) return <div className="message">{empty}</div>;
  return (
    <ul className="request-list">
      {requests.map((request) => (
        <li key={request.id}>
          <RequestCard request={request} />
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = TABS.some((t) => t.key === searchParams.get("flik")) ? searchParams.get("flik") : "mottagna";

  const [data, setData] = useState(null); // { items, sent, received, ongoing }
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    getDashboard(token)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Tillbaka till förra sidan i appen. Har sidan öppnats via en länk finns ingen, då går vi till Profil.
  // React Router numrerar sidorna i webbläsarens historik (idx), där 0 är första sidan i appen.
  function handleBack() {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/profile");
  }

  // replace: flikbyten ska inte bli egna steg i historiken
  function selectTab(key) {
    setSearchParams(key === "mottagna" ? {} : { flik: key }, { replace: true });
  }

  const counts = data && { mottagna: data.received.length, skickade: data.sent.length, annonser: data.items.length };

  return (
    <section className="page dashboard">
      <div className="details-topbar">
        <button type="button" className="back-link" onClick={handleBack}>
          ← Tillbaka
        </button>
      </div>
      <h1 className="page-title">Mina annonser &amp; förfrågningar</h1>

      <div className="tabs" role="group" aria-label="Visa">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={"tab" + (tab === t.key ? " tab-active" : "")}
            aria-pressed={tab === t.key}
            onClick={() => selectTab(t.key)}
          >
            {t.label}
            {counts && ` (${counts[t.key]})`}
          </button>
        ))}
      </div>

      {error && (
        <p className="message message-error" role="alert">
          Kunde inte hämta översikten. {error}
        </p>
      )}

      {!error && !data && <p className="muted">Hämtar översikten…</p>}

      {data && tab === "mottagna" && (
        <RequestList requests={data.received} empty={<p>Inga förfrågningar på dina annonser än.</p>} />
      )}

      {data && tab === "skickade" && (
        <RequestList
          requests={data.sent}
          empty={
            <p>
              Du har inte skickat några förfrågningar än. <Link to="/">Hitta något att låna</Link>
            </p>
          }
        />
      )}

      {data && tab === "annonser" &&
        (data.items.length === 0 ? (
          <div className="message">
            <p>
              Du har inga annonser än. <Link to="/add-item">Lägg upp något!</Link>
            </p>
          </div>
        ) : (
          <ItemList items={data.items} />
        ))}
    </section>
  );
}
