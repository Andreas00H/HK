// Kategorifilter överst på Hem. "Alla" visar alla kategorier. Raden scrollar i sidled i mobil.
export default function CategoryFilter({ categories, selectedId, onSelect }) {
  return (
    <div className="category-filter" role="group" aria-label="Filtrera på kategori">
      <button
        type="button"
        className={"chip" + (selectedId === null ? " chip-active" : "")}
        aria-pressed={selectedId === null}
        onClick={() => onSelect(null)}
      >
        Alla
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={"chip" + (selectedId === category.id ? " chip-active" : "")}
          aria-pressed={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
