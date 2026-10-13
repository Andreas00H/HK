// Provider för användarens valda stad. Styr vilka annonser som visas på Hem.
// Standard är Stockholm (UI.UX.md, beslut om gäster). Profil-sidan ska senare kunna byta stad med setCity.
import { useState } from "react";
import { CityContext } from "./cityContext.js";

export function CityProvider({ children }) {
  const [city, setCity] = useState("Stockholm");
  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}
