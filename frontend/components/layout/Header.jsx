// Sidhuvud: logotyp till vänster och vald stad till höger. På dator visas menyn här i stället för i botten.
import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.js";
import { useCity } from "../../hooks/useCity.js";

export default function Header() {
  // Vald stad kommer från CityContext (standard Stockholm)
  const { city } = useCity();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          HK <span className="header-logo-sub">Hyra inte Köpa</span>
        </Link>

        <nav className="header-nav" aria-label="Huvudmeny">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => "header-nav-link" + (isActive ? " active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Länk till Profil där man byter stad. Kartnål i stället för ▾, eftersom en pil
            får det att se ut som en rullista som öppnas här (UI.UX.md, beslut 2026-10-22). */}
        <Link to="/profile" className="header-city" aria-label={"Vald stad: " + city + ". Byt stad på Profil"}>
          <svg className="header-city-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
          </svg>
          {city}
        </Link>
      </div>
    </header>
  );
}
