// Hook för vald stad. Används t.ex. så här: const { city, setCity } = useCity();
import { useContext } from "react";
import { CityContext } from "../context/cityContext.js";

export function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity måste användas inuti CityProvider");
  return context;
}
