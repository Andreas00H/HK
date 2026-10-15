// Hem: alla annonser i vald stad, sökfält och kategorifilter överst (UI.UX.md, Hem).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/items/SearchBar.jsx";
import CategoryFilter from "../components/items/CategoryFilter.jsx";
import ItemList from "../components/items/ItemList.jsx";
import { getCategories } from "../services/categoryService.js";
import { useItems } from "../hooks/useItems.js";
import { useCity } from "../hooks/useCity.js";
import "../assets/styles/items.css";

export default function Home() {
  const { city } = useCity();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);

  // Kategorierna hämtas en gång. Går det fel visas bara "Alla".
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Bara mellanslag räknas som ingen sökning, både i anropet och i texten när listan är tom
  const query = search.trim();
  const { items, loading, error } = useItems({ search: query, categoryId, location: city });

  return (
    <section className="page home">
      <h1 className="visually-hidden">Annonser i {city}</h1>

      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter categories={categories} selectedId={categoryId} onSelect={setCategoryId} />

      {loading && <p className="muted">Hämtar annonser…</p>}

      {!loading && error && (
        <p className="message message-error" role="alert">
          Kunde inte hämta annonser. {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="message">
          {query || categoryId ? (
            <p>Inga annonser matchar din sökning.</p>
          ) : (
            <p>
              Inga annonser i {city} än. <Link to="/add-item">Bli först med att lägga upp något!</Link>
            </p>
          )}
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="list-meta muted">
            <span>Visar {items.length} {items.length === 1 ? "annons" : "annonser"}</span>
            <span>Senaste</span>
          </div>
          <ItemList items={items} />
        </>
      )}
    </section>
  );
}
