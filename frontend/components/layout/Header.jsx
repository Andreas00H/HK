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

        <Link to="/profile" className="header-city" aria-label={"Vald stad: " + city + ". Byt stad på Profil"}>
          {city} ▾
        </Link>
      </div>
    </header>
  );
}
