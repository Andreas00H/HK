// Sökfält för specifika saker, t.ex. borrmaskin eller kablar.
import Icon from "../common/Icon.jsx";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="search" className="visually-hidden">
        Sök annonser
      </label>
      <Icon name="search" className="search-icon" />
      <input
        id="search"
        type="search"
        placeholder="Vad vill du låna?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
