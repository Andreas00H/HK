// Bottenmeny i mobil: Hem, Lägg upp, Kontakter, Profil (Figma). Aktivt val blir blått.
// Lägg upp har alltid ett vitt plus i en blå pill.
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.js";
import Icon from "../common/Icon.jsx";

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
          {item.icon === "plus" ? (
            <span className="nav-pill">
              <Icon name="plus" size={18} />
            </span>
          ) : (
            <Icon name={item.icon} />
          )}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
