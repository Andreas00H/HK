// Bottenmeny i mobil: Hem, Lägg upp, Kontakter, Profil. Aktivt val blir blått.
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.js";
import NavIcon from "./NavIcon.jsx";

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Huvudmeny">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => "bottom-nav-link" + (isActive ? " active" : "")}
        >
          <NavIcon name={item.icon} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
