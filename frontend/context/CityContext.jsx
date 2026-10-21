// Provider för vald stad. Styr vilka annonser som visas på Hem (location i GET /api/items).
// Inloggad: staden från profilen. Gäst: alltid Stockholm (UI.UX.md, beslut 2026-10-13).
// setCity byter stad för den inloggade, t.ex. från stadsvalet på Profil. Backend kan inte spara stad än,
// så bytet gäller tills sidan laddas om eller man loggar ut.
import { useState } from "react";
import { CityContext } from "./cityContext.js";
import { useAuth } from "../hooks/useAuth.js";

const DEFAULT_CITY = "Stockholm";

export function CityProvider({ children }) {
  const { user } = useAuth();
  // Stad som valts med setCity. Kopplas till just den här inloggningen (user-objektet är nytt vid varje
  // inloggning), så bytet försvinner vid utloggning och följer inte med till nästa konto.
  const [chosen, setChosen] = useState(null); // { user, city }

  let city = DEFAULT_CITY;
  if (user) city = chosen?.user === user ? chosen.city : user.location || DEFAULT_CITY;

  // Gäster kan inte byta stad
  function setCity(newCity) {
    if (user) setChosen({ user, city: newCity });
  }

  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}
