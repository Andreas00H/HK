// Rullista för vilken stad annonserna på Hem visas i (UI.UX.md 8.1, Stad). value är vald stad, onChange får den nya.
// Listan har Sveriges största städer. Städer i extraCities (t.ex. staden i profilen) läggs till om de saknas,
// så att de alltid går att välja.
import Input from "../common/Input.jsx";

const CITIES = [
  "Borås", "Eskilstuna", "Gävle", "Göteborg", "Halmstad", "Helsingborg", "Jönköping", "Karlstad", "Linköping",
  "Luleå", "Lund", "Malmö", "Norrköping", "Stockholm", "Sundsvall", "Södertälje", "Umeå", "Uppsala", "Västerås",
  "Växjö", "Örebro",
];

// Samma stad med olika stora bokstäver räknas som en, precis som i backend
function sameCity(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

export default function CitySelect({ id, label, value, extraCities = [], onChange }) {
  const options = [...CITIES];
  for (const city of [value, ...extraCities]) {
    if (city && !options.some((option) => sameCity(option, city))) options.push(city);
  }
  options.sort((a, b) => a.localeCompare(b, "sv"));

  return (
    <Input
      as="select"
      id={id}
      label={label}
      value={options.find((option) => sameCity(option, value)) || ""}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </Input>
  );
}
