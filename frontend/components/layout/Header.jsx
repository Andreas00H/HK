// Sidhuvud på dator: logotyp, menyn och vald stad. I mobil döljs det, där har varje sida sitt eget toppfält (Figma).
import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.js";
import Icon from "../common/Icon.jsx";
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
<Icon name="pin" size={16} className="header-city-icon" />
          {city}
        </Link>
      </div>
    </header>
  );
}
