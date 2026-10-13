// Sökfält för specifika saker, t.ex. borrmaskin eller kablar.
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="search" className="visually-hidden">
        Sök annonser
      </label>
      <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        id="search"
        type="search"
        placeholder="Sök t.ex. borrmaskin"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
